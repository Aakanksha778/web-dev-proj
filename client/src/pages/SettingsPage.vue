<template>
  <section>
    <div class="page-header">
      <div>
        <h1>Settings</h1>
        <p>Manage your profile, notifications, and budgeting preferences.</p>
      </div>
      <button class="btn btn-brand">Save settings</button>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Profile</h2>
          <form>
            <div class="mb-3">
              <label class="form-label">Full name</label>
              <input type="text" class="form-control" value="Avery Morgan" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="avery@example.com" />
            </div>
            <div class="mb-3">
              <label class="form-label">Timezone</label>
              <select class="form-select">
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Asia/Singapore</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card page-card p-4">
          <h2 class="h5 mb-4">Preferences</h2>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="notifications" checked />
            <label class="form-check-label" for="notifications">Email notifications</label>
          </div>
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="autobudget" />
            <label class="form-check-label" for="autobudget">Auto-adjust budgets</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="darkmode" />
            <label class="form-check-label" for="darkmode">Dark mode preview</label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
