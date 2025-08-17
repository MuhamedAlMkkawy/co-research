<template>
  <section class="footer">
    <div class="image">
      <img src="/assets/images/footer_logo.png" alt="image" loading="lazy">
    </div>
    <ul>
      <li>
        <NuxtLink :to="localeRoute('/')">{{ $t('footer.links.home') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/projects')">{{ $t('footer.links.projects') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/chats')">{{ $t('footer.links.chats') }}</NuxtLink>
      </li>
    </ul>
    <ul>
      <li>
        <NuxtLink :to="localeRoute('/terms')">{{ $t('footer.links.terms') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/privacy')">{{ $t('footer.links.privacy') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/about')">{{ $t('footer.links.about') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/contact')">{{ $t('footer.links.contact') }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localeRoute('/complaints')">{{ $t('footer.links.complaints') }}</NuxtLink>
      </li>
    </ul>
    <p>{{ $t('footer.rights') }} &copy; 2025 </p>
    <p>{{ $t('footer.design') }}</p>
  </section>
</template>

<script setup>
  // define localeRoute 
  const localeRoute = useLocaleRoute()
</script>

<style lang="scss" scoped>
  section.footer{
    background: #6F6F6F;
    text-align: center;
    color: #fff;
    .image{
      max-width: 100px;
      margin: 0 auto 30px;
    }
    ul{
      @include displayFlex($gap : clamp(20px , 2.5vw , 50px), $wrap : wrap);
      margin-bottom: clamp(20px , 2.5vw , 50px);
      li{
        a{
          position: relative;
          padding-block: 4px;
          margin-block: 2px;
          display: block;
          &::after{
            content: '';
            position: absolute;
            left: 0;
            bottom: 1px;
            width: 0%;
            height: 1px;
            background: #fff;
            transition: 0.6s;
          }
          &::before{
            content: '';
            position: absolute;
            right: 0;
            top: 1px;
            width: 0%;
            height: 1px;
            background: #fff;
            transition: 0.6s;
          }
          &:hover{
            &::before ,
            &::after{
              width: 100%;
            }
          }
        }
      }
    }
    p{
      font-size: clamp(14px , 4vw , 16px);
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
</style>