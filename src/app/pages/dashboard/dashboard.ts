import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ApiKeysService } from '../../shared/services/api-keys.service';
import { ApiKey, User } from '../../shared/models/api.models';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgIf, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser = signal<User | null>(null);
  loadingUser = signal(false);

  apiKeys = signal<ApiKey[]>([]);
  loading = signal(false);
  loadError = signal(false);

  showCreateModal = signal(false);
  creatingKey = signal(false);
  createdKey = signal<string | null>(null);
  copiedKey = signal(false);
  keyToRevoke = signal<ApiKey | null>(null);
  revokingKey = signal(false);
  createKeyForm: FormGroup;

  constructor(
    private authService: AuthService,
    private apiKeysService: ApiKeysService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createKeyForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadApiKeys();
  }

  loadCurrentUser(): void {
    const cached = this.authService.currentUser;
    if (cached) {
      this.currentUser.set(cached);
      return;
    }

    this.loadingUser.set(true);
    this.authService.currentUser$.pipe(
      finalize(() => { this.loadingUser.set(false); })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.currentUser.set(user);
          this.loadingUser.set(false);
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  loadApiKeys(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.apiKeysService.getMyKeys().pipe(
      catchError((err) => {
        console.error('Error loading API keys:', err);
        this.loadError.set(true);
        return of([]);
      }),
      finalize(() => { this.loading.set(false); })
    ).subscribe((keys) => {
      this.apiKeys.set(Array.isArray(keys) ? keys : []);
    });
  }

  createApiKey(): void {
    if (this.createKeyForm.valid) {
      this.creatingKey.set(true);
      this.apiKeysService.createKey(this.createKeyForm.value).pipe(
        finalize(() => { this.creatingKey.set(false); })
      ).subscribe({
        next: (res) => {
          this.createKeyForm.reset();
          this.showCreateModal.set(false);
          const fullKey = (res as any)?.key ?? null;
          if (fullKey) {
            this.createdKey.set(fullKey);
            this.copiedKey.set(false);
          }
          this.loadApiKeys();
        },
        error: (err) => {
          console.error('Error creating API key:', err);
        }
      });
    }
  }

  copyCreatedKey(): void {
    const key = this.createdKey();
    if (!key) return;
    navigator.clipboard.writeText(key).then(() => { this.copiedKey.set(true); });
  }

  closeCreatedKeyModal(): void {
    this.createdKey.set(null);
    this.copiedKey.set(false);
  }

  openRevokeModal(key: ApiKey): void {
    this.keyToRevoke.set(key);
  }

  closeRevokeModal(): void {
    this.keyToRevoke.set(null);
  }

  confirmRevoke(): void {
    const key = this.keyToRevoke();
    if (!key) return;
    this.revokingKey.set(true);
    this.apiKeysService.revokeKey(key.id).pipe(
      catchError((err) => {
        console.error('Error revoking API key:', err);
        return of(null);
      }),
      finalize(() => { this.revokingKey.set(false); })
    ).subscribe(() => {
      this.keyToRevoke.set(null);
      this.loadApiKeys();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

