<template>
  <div class="min-h-screen flex flex-col font-sans">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
