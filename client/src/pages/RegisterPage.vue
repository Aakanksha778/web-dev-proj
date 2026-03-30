<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card page-card p-4">
        <h1 class="h3 mb-3">Create your account</h1>
        <p class="text-muted mb-4">Get started with a secure place to manage your finances.</p>
        <form>
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" placeholder="Jane Doe" />
          </div>
          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input type="email" class="form-control" placeholder="name@example.com" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" placeholder="Create password" />
          </div>
          <button type="button" class="btn btn-brand w-100">Create Account</button>
        </form>
        <p class="text-center text-muted mt-4 mb-0">Already have an account? <router-link to="/login">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>
