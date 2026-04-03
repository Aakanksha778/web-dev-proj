import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import TransactionsPage from '../pages/TransactionsPage.vue'
import BudgetsPage from '../pages/BudgetsPage.vue'
import GoalsPage from '../pages/GoalsPage.vue'
import InsightsPage from '../pages/InsightsPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import RequestHistoryPage from '../pages/RequestHistoryPage.vue'
import ApprovalDashboardPage from '../pages/ApprovalDashboardPage.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import { useAuth } from '../stores/auth'

const routes = [
  { path: '/',            name: 'Home',      component: LandingPage },
  { path: '/login',       name: 'Login',     component: LoginPage,              meta: { guestOnly: true } },
  { path: '/register',    name: 'Register',  component: RegisterPage,           meta: { guestOnly: true } },
  { path: '/dashboard',   name: 'Dashboard', component: DashboardPage,          meta: { requiresAuth: true } },
  { path: '/transactions',name: 'Transactions', component: TransactionsPage,    meta: { requiresAuth: true } },
  { path: '/budgets',     name: 'Budgets',   component: BudgetsPage,            meta: { requiresAuth: true } },
  { path: '/goals',       name: 'Goals',     component: GoalsPage,              meta: { requiresAuth: true } },
  { path: '/insights',    name: 'Insights',  component: InsightsPage,           meta: { requiresAuth: true } },
  { path: '/settings',    name: 'Settings',  component: SettingsPage,           meta: { requiresAuth: true } },
  { path: '/requests',    name: 'Requests',  component: RequestHistoryPage,     meta: { requiresAuth: true } },
  { path: '/approvals',   name: 'Approvals', component: ApprovalDashboardPage,  meta: { requiresAuth: true } },
  { path: '/welcome',     name: 'Welcome',   component: WelcomePage,            meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const { user } = useAuth()

  if (to.meta.requiresAuth && !user.value) {
    return { name: 'Login' }
  }

  if (to.meta.guestOnly && user.value) {
    return { name: 'Dashboard' }
  }
})

export default router
