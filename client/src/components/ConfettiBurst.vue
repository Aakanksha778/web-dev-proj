<template>
  <div class="confetti-overlay">
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="confetti-piece"
      :style="piece.style"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { randomInt, randomFloat } from '../utils/confettiUtils'

const emit = defineEmits(['finished'])
const pieces = ref([])

onMounted(() => {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#14b8a6', '#fb7185']

  pieces.value = Array.from({ length: 60 }, (_, idx) => {
    const left = randomFloat(0, 100)
    const size = randomInt(8, 14)
    const duration = randomFloat(2.5, 4.5)
    const delay = randomFloat(0, 0.8)
    const drift = randomInt(-120, 120)
    const startRotate = randomInt(0, 360)
    const endRotate = startRotate + randomInt(360, 1080)

    return {
      id: idx,
      style: {
        '--left': `${left}vw`,
        '--size': `${size}px`,
        '--color': colors[randomInt(0, colors.length - 1)],
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
        '--drift': `${drift}px`,
        '--start-rotate': `${startRotate}deg`,
        '--end-rotate': `${endRotate}deg`,
      },
    }
  })

  setTimeout(() => emit('finished'), 5500)
})
</script>

<style scoped>
.confetti-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1050;
}

.confetti-piece {
  position: absolute;
  left: var(--left);
  top: -20px;
  width: var(--size);
  height: calc(var(--size) * 1.4);
  background: var(--color);
  border-radius: 4px;
  opacity: 0.95;
  will-change: transform, opacity;
  animation: confetti-fall var(--duration) linear var(--delay) forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(var(--start-rotate));
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--drift), 110vh, 0) rotate(var(--end-rotate));
    opacity: 0;
  }
}
</style>