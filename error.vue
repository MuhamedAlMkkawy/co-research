<template>
  <div class="error_page">
    <div class="image">
      <img src="/assets/images/logo.png" alt="logo image" loading="lazy">
    </div>
    <h1>
      4 
      <NotFoundEyes/>
      4
    </h1>
    <h3>
      {{ 
        globalStore.lang == 'en'?
        'Page is Not Found ' :
        'الصفحة غير موجوده'
      }}
    </h3>
    <NuxtLink :to="localeRoute('/')" @click="globalStore.setLang('ar')" class="main-btn">
      {{ 
        globalStore.lang == 'en'?
        'Go To Home Page' :
        'أذهب للرئيسية'
      }}
    </NuxtLink>
  </div>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()

  // define locale route
  const localeRoute = useLocaleRoute()

  // eye tracking
  const eyePosition = ref({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { left, top } = e.currentTarget.getBoundingClientRect()
    
    eyePosition.value = {
      x: clientX - left,
      y: clientY - top
    }
  }

  const eyeStyle = computed(() => {
    if (!eyePosition.value.x && !eyePosition.value.y) {
      return {}
    }
    
    // Calculate angle and distance for pupil position
    const eyeContainer = document.querySelector('.eyes-container')
    if (!eyeContainer) return {}
    
    const eyeRect = eyeContainer.getBoundingClientRect()
    const eyeCenterX = eyeRect.left + eyeRect.width / 2
    const eyeCenterY = eyeRect.top + eyeRect.height / 2
    
    const angle = Math.atan2(
      eyePosition.value.y - eyeCenterY,
      eyePosition.value.x - eyeCenterX
    )
    
    // Limit how far the pupil can move (so it stays within the eye)
    const distance = Math.min(10, Math.sqrt(
      Math.pow(eyePosition.value.x - eyeCenterX, 2) + 
      Math.pow(eyePosition.value.y - eyeCenterY, 2)
    ) / 10)
    
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    
    return {
      transform: `translate(${x}px, ${y}px)`
    }
  })
</script>

<style lang="scss" scoped>
  .error_page{
    @include displayFlex($direction : column , $gap : 0);
    height: 100vh;
    background: #fff;
    position: relative;
    .image{
      width: 300px;
      margin: 0 auto;
      @media (max-width : 560px){
        width: 200px;
      }
    }

    h1{
      font-size: 150px;
      margin-bottom: 0px;
      color: $mainColor;
      @include displayFlex($gap : 0);
      span{
        color: $secColor;
      }
    }

    h3{
      font-size: clamp(30px , 100% , 300px);
      margin-bottom: 10px;
    }
    a{
      max-width: 500px;
    }
  }
</style>