import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface State {
  _id: string;
  name: string;
  state: string;
  charge: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-manage-countries',
  templateUrl: './manage-countries.component.html',
  styleUrls: ['./manage-countries.component.css']
})
export class ManageCountriesComponent implements OnInit {
  states: State[] = [];
  currentState: State = this.getEmptyState();
  editMode = false;
  selectedStateIndex: number | null = null;
  makeLoading:boolean=false;

  constructor(private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStates();
  }

  fetchStates(): void {
    this.makeLoading=true;
    this.http.get<State[]>(environment.httpUrl+'country-api/display-country-data')
      .subscribe({
        next: (res) => this.states = res,
        error: () => this.toastr.error('Unable to get states!')
      });
      this.makeLoading=false;
  }

  submitState(): void {
    if (!this.currentState.name || !this.currentState.state || !this.currentState.charge) {
      this.toastr.error('Please fill all fields.', 'Error');
      return;
    }

    if (this.editMode && this.selectedStateIndex !== null) {

      this.makeLoading=true;
      this.http.put(`${environment.httpUrl}country-api/update-state-data/${this.currentState._id}`,this.currentState).
      subscribe({
        next:(res)=>{
          this.makeLoading=false;
          this.toastr.info('State updated successfully!', 'Updated');

        },
        error:(err:any)=>{
          this.makeLoading=false;
          this.toastr.error(err.error.message);
        }
      });
      this.states[this.selectedStateIndex] = { ...this.currentState };
    } else {
      this.makeLoading=true;
      this.http.post(environment.httpUrl+'country-api/insert-country-data', this.currentState)
        .subscribe({
          next: () => {
            this.states.push({ ...this.currentState });
            this.makeLoading=false;
            this.toastr.success('State added successfully!', 'Success');
          },
          error: () => {
            this.makeLoading=false;
            this.toastr.error('Unable to add state')}
        });
    }

    this.resetForm();
  }

  editState(index: number): void {
    this.selectedStateIndex = index;
    this.currentState = { ...this.states[index] };
    this.editMode = true;
  }

  deleteState(id: string, name: string): void {
    this.makeLoading=true;
    this.http.delete(`${environment.httpUrl}country-api/delete-state-data/${id}`)
      .subscribe({
        next: () => {
          this.makeLoading=false;
          this.toastr.success(`${name} deleted!`, 'Deleted');
          this.states = this.states.filter(state => state._id !== id);
        },
        error: () => {
          this.makeLoading=false;
          this.toastr.error('Unable to delete state')}
      });
  }

  resetForm(): void {
    this.currentState = this.getEmptyState();
    this.editMode = false;
    this.selectedStateIndex = null;
    window.location.reload();
  }

  private getEmptyState(): State {
    return { _id: '', name: '', state: '', charge: 0, isAvailable: true };
  }
}
