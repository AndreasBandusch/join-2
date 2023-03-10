import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from '../models/task.model';
import { ControlService } from './control.service';
import { CustomformcontrolModule } from 'src/app/modules/customformcontrol/customformcontrol.module';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  currentTask: any = {};
  title: string = '';
  description: string = '';
  categoryId: number = 0;
  assignedContactIdsForTask: any[] = [];
  dueDateTimestamp: number = 0;
  activePrio: string = '';
  assignedSubtasks: any[] = [];
  selectedCategory: string = '';
  selectedContacts: { [key: number]: boolean } = {};


  dueDate: string = '';
  dueDateOutput: string = '';
  showCategorys: boolean = false;
  showSubtask: boolean = false;
  catText: string = '';
  catStartText: string = 'Select task category';
  catColor: any = '';
  allSubtasks: any[] = [];
  showAssignedTo: boolean = false;
  selectedSubtasks: any[] = [];

  constructor(
    private db: AngularFirestore,
    public control: ControlService,
    private fControl: CustomformcontrolModule) { }

  loadAssignedContactsInSelectedContacts() {
    for (let i = 0; i < this.currentTask.assignedTo.length; i++) {
      let contact = this.currentTask.assignedTo[i];
      this.selectedContacts[contact.id] = true;
    }
  }


  createTask() {
    let newTask = new Task(this.title,
      this.description,
      this.categoryId,
      this.assignedContactIdsForTask,
      this.dueDateTimestamp,
      this.activePrio,
      this.assignedSubtasks);
    this.saveTask(newTask);
    this.resetForm();
  }


  saveTask(newTask: any) {
    this.db
      .collection('tasks')
      .add(newTask.toJSON()).then(() => {
        if (!this.control.isOpenedInOverlay) {
          this.control.getMessage('Task added to board', 'assets/img/icons/add-task-board-icon.png');
        }
        this.control.isOpenedInOverlay = false;
      });
  }

  getTimestamp() {
    this.dueDateTimestamp = new Date(this.dueDate).getTime();
  }

  updateSelectedContacts() {
    this.assignedContactIdsForTask = [];
    for (let key in this.selectedContacts) {
      if (this.selectedContacts[key] && !this.assignedContactIdsForTask.includes(key)) {
        this.assignedContactIdsForTask.push(key);
      }
    }
    console.log(this.currentTask.assignedTo);
    console.log('Selected: ', this.selectedContacts);
  }


  getPrioImage(prio: string): string {
    switch (prio) {
      case 'low':
        return 'add-task-low';

      case 'medium':
        return 'add-task-medium';

      case 'urgent':
        return 'add-task-urgent';

      default:
        return '';
    }
  }


  getContactIntialsStyles(color: string, index: number): object {
    let styles = {
      'background-color': color,
      'transform': `translateX(${index * 75}%)`
    }
    return styles;
  }



  resetForm() {
    this.description = '';
    this.selectedCategory = '';
    this.selectedContacts = [];
    this.dueDate = '';
    this.activePrio = '';
    this.showCategorys = false;
    this.showSubtask = false;
    this.title = '';
    this.catText = this.catStartText;
    this.catColor = '';
    this.allSubtasks = [];
    this.showAssignedTo = false;
    this.selectedSubtasks = [];
    this.assignedSubtasks = [];
    this.assignedContactIdsForTask = [];
    this.categoryId = 0;
  }

  setDueDateOutput() {
    let date = new Date(this.dueDate);
    this.dueDateOutput = date.toLocaleString('en-US', { day: '2-digit' })
      + '-' + date.toLocaleString('en-EN', { month: '2-digit' })
      + '-' + date.getFullYear();
  }


  deleteTask() {
    const docId = this.currentTask.docId
    this.control.taskDetailsDialogOpen = false;
    this.db.collection('tasks').doc(docId).delete().then(() => {
      this.control.showDeleteTaskDialog = false;
      this.control.getMessage('Task deleted !');
    });

  }

  setPrio(prio: string) {
    this.activePrio = prio;
    this.fControl.prioErrorMessage = '';
  }
}
