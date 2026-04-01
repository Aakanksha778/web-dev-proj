<template>
  <section class="landing-page">
    <section class="hero-section">
      <div class="hero-glow hero-glow--one"></div>
      <div class="hero-glow hero-glow--two"></div>

      <div class="hero-grid">
        <div class="hero-copy">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            Smarter money habits start here
          </div>

          <h1 class="hero-title">
            Budget with clarity.
            <span>Grow with purpose.</span>
          </h1>

          <p class="hero-subtitle">
            CentSora helps students and families track spending, build healthier habits,
            and stay organized with a budgeting experience that feels calm, clear, and easy to keep up with.
          </p>

          <div class="hero-actions">
            <router-link class="btn btn-primary hero-btn" to="/register">
              Get started free
            </router-link>
            <router-link class="btn btn-ghost hero-btn" to="/dashboard">
              Explore dashboard
            </router-link>
          </div>

          <div class="hero-trust-line">
            <span>No spreadsheets</span>
            <span>No overwhelm</span>
            <span>Just clarity</span>
          </div>
        </div>

        <div class="hero-visual-shell">
          <div class="hero-main-panel">
            <div class="hero-panel-top">
              <div>
                <p class="hero-panel-label">Monthly budget health</p>
                <h3>$2,940 left</h3>
              </div>
              <span class="hero-panel-chip">On track</span>
            </div>

            <div class="hero-mini-chart">
              <div class="hero-bars">
                <span style="height: 38%"></span>
                <span style="height: 56%"></span>
                <span style="height: 44%"></span>
                <span style="height: 72%"></span>
                <span style="height: 63%"></span>
                <span style="height: 88%"></span>
              </div>
            </div>

            <div class="hero-spend-grid">
              <div class="hero-spend-card">
                <p>Needs</p>
                <strong>$1,420</strong>
              </div>
              <div class="hero-spend-card">
                <p>Savings</p>
                <strong>$900</strong>
              </div>
              <div class="hero-spend-card hero-spend-card--wide">
                <p>Weekly insight</p>
                <strong>Friday is your highest spending day</strong>
              </div>
            </div>
          </div>

          <div class="floating-stat floating-stat--one">
            <span>Emergency fund</span>
            <strong>56% complete</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-features">
      <div class="section-heading">
        <p class="section-kicker">Features</p>
        <h2>Clean budgeting tools that actually help you stay in control</h2>
      </div>

      <div class="landing-feature-grid landing-feature-grid--three">
        <article class="landing-feature-card featured-card">
          <div class="feature-icon">📊</div>
          <h3>Live budget visibility</h3>
          <p>
            See how much room is left in each category before spending starts to slip off track.
          </p>
        </article>

        <article class="landing-feature-card">
          <div class="feature-icon">💳</div>
          <h3>Clear transaction tracking</h3>
          <p>
            Keep spending organized in one place with a layout that makes patterns easy to understand.
          </p>
        </article>

        <article class="landing-feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Goal-focused savings</h3>
          <p>
            Turn savings goals into visible progress that keeps you motivated and moving forward.
          </p>
        </article>
      </div>
    </section>

    <section class="how-it-works-section">
      <div class="section-heading">
        <p class="section-kicker">How it works</p>
        <h2>Simple flow. Better habits.</h2>
        <p class="section-subtitle">
          A calm routine that helps you understand where your money is going and what to do next.
        </p>
      </div>

      <div class="how-grid">
        <div class="how-card">
          <span class="how-number">01</span>
          <h3>Set your budgets</h3>
          <p>Create categories that reflect how you actually spend each month.</p>
        </div>

        <div class="how-card">
          <span class="how-number">02</span>
          <h3>Track activity</h3>
          <p>Monitor transactions clearly and understand where your money is really going.</p>
        </div>

        <div class="how-card">
          <span class="how-number">03</span>
          <h3>Grow your goals</h3>
          <p>Stay motivated with progress visuals that make saving feel more rewarding.</p>
        </div>
      </div>
    </section>

    <section class="landing-cta-section">
      <div class="landing-cta-card">
        <p class="section-kicker">Start today</p>
        <h2>Take control of your money with a dashboard that feels helpful, not heavy.</h2>
        <p>
          Organize budgets, monitor spending, and build stronger savings habits with more confidence.
        </p>
        <div class="hero-actions">
          <router-link class="btn btn-primary hero-btn" to="/register">
            Create account
          </router-link>
          <router-link class="btn btn-ghost hero-btn" to="/login">
            Sign in
          </router-link>
        </div>
      </div>
    </section>
  </section>
</template>
