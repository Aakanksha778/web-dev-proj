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

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
  { path: '/transactions', name: 'Transactions', component: TransactionsPage },
  { path: '/budgets', name: 'Budgets', component: BudgetsPage },
  { path: '/goals', name: 'Goals', component: GoalsPage },
  { path: '/insights', name: 'Insights', component: InsightsPage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/requests', name: 'Requests', component: RequestHistoryPage },
  { path: '/approvals', name: 'Approvals', component: ApprovalDashboardPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
