<script setup>
import { ref, computed } from 'vue'
import {
  prepareWithSegments,
  layoutNextLineRange,
  materializeLineRange
} from '@chenglou/pretext'

const article = ref(`Pretext lets us manually decide how wide each line of text is. 
That is the key idea behind wrapping text around an object.

In normal CSS, text wrapping around arbitrary objects is limited. CSS float can wrap around a box, and shape-outside can do some shape-based wrapping, but it does not give you full JavaScript control line by line.

Here, the blue card is just another div. The text does not naturally flow around it. Instead, we calculate each text line ourselves. For every line, we ask whether that vertical position overlaps the obstacle div. If it does, the line becomes narrower and starts after the obstacle. If it does not, the line uses the full column width.

This means you can later replace the rectangle logic with a circle, an image alpha mask, a character silhouette, or even an animated object.`)

const columnWidth = ref(760)
const lineHeight = 26

// Use a specific font, not system-ui, because Pretext warns that system-ui
// can be unsafe for layout accuracy on macOS.
const font = `18px Arial`

const obstacle = ref({
  x: 0,
  y: 48,
  width: 260,
  height: 190,
  padding: 22
})

const prepared = computed(() => {
  return prepareWithSegments(article.value, font, {
    whiteSpace: 'pre-wrap'
  })
})

const lines = computed(() => {
  const output = []

  let cursor = {
    segmentIndex: 0,
    graphemeIndex: 0
  }

  let y = 0

  while (true) {
    const lineTop = y
    const lineBottom = y + lineHeight

    const obstacleLeft = obstacle.value.x
    const obstacleRight = obstacle.value.x + obstacle.value.width
    const obstacleTop = obstacle.value.y
    const obstacleBottom = obstacle.value.y + obstacle.value.height

    const overlapsObstacleVertically =
      lineBottom > obstacleTop && lineTop < obstacleBottom

    let x = 0
    let availableWidth = columnWidth.value

    if (overlapsObstacleVertically) {
      x = obstacleRight + obstacle.value.padding
      availableWidth = columnWidth.value - x
    }

    // Safety guard. If the obstacle takes too much space, avoid giving Pretext
    // a tiny or negative width.
    availableWidth = Math.max(40, availableWidth)

    const range = layoutNextLineRange(
      prepared.value,
      cursor,
      availableWidth
    )

    if (range === null) {
      break
    }

    const line = materializeLineRange(prepared.value, range)

    output.push({
      text: line.text,
      x,
      y,
      width: line.width,
      availableWidth
    })

    cursor = range.end
    y += lineHeight
  }

  return output
})

const textBlockHeight = computed(() => {
  return lines.value.length * lineHeight
})
</script>

<template>
  <main class="page">
    <section class="controls">
      <label>
        Column width:
        <input
          v-model.number="columnWidth"
          type="range"
          min="420"
          max="980"
        />
        <span>{{ columnWidth }}px</span>
      </label>

      <label>
        Obstacle Y:
        <input
          v-model.number="obstacle.y"
          type="range"
          min="0"
          max="360"
        />
        <span>{{ obstacle.y }}px</span>
      </label>

      <label>
        Obstacle width:
        <input
          v-model.number="obstacle.width"
          type="range"
          min="120"
          max="360"
        />
        <span>{{ obstacle.width }}px</span>
      </label>

      <label>
        Obstacle height:
        <input
          v-model.number="obstacle.height"
          type="range"
          min="80"
          max="320"
        />
        <span>{{ obstacle.height }}px</span>
      </label>
    </section>

    <section
      class="layout"
      :style="{
        width: columnWidth + 'px',
        height: textBlockHeight + 'px'
      }"
    >
      <div
        class="obstacle"
        :style="{
          left: obstacle.x + 'px',
          top: obstacle.y + 'px',
          width: obstacle.width + 'px',
          height: obstacle.height + 'px'
        }"
      >
        <strong>Obstacle div</strong>
        <span>The text wraps around this.</span>
      </div>

      <div
        v-for="(line, index) in lines"
        :key="index"
        class="text-line"
        :style="{
          transform: `translate(${line.x}px, ${line.y}px)`,
          width: line.availableWidth + 'px',
          height: lineHeight + 'px',
          lineHeight: lineHeight + 'px',
          font
        }"
      >
        {{ line.text }}
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px;
  background: #f2f2f2;
  color: #111;
}

.controls {
  display: grid;
  gap: 10px;
  max-width: 760px;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 14px;
}

.controls label {
  display: grid;
  grid-template-columns: 150px 1fr 80px;
  align-items: center;
  gap: 12px;
  font: 14px Arial;
}

.layout {
  position: relative;
  overflow: visible;
  min-height: 400px;
  padding: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 18px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
}

.obstacle {
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  padding: 18px;
  border-radius: 18px;
  background: #d9e8ff;
  border: 1px solid #8bbcff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  font: 16px Arial;
}

.obstacle strong {
  font-size: 20px;
}

.obstacle span {
  opacity: 0.75;
}

.text-line {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  white-space: pre;
  overflow: visible;
  box-sizing: border-box;
}
</style>