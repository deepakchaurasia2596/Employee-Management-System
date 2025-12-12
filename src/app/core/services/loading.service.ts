import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  show(): void {
    this._isLoading = true;
  }

  hide(): void {
    this._isLoading = false;
  }
}
