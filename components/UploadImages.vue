<template>
  <div 
    class="upload-container"
    @dragover.prevent="dragOver = true"
    @dragleave="dragOver = false"
    @drop.prevent="handleDrop"
    :class="{ 'drag-over': dragOver }"
  >
    <label :for="props.id" class="upload_image">
      <i class="pi pi-file-arrow-up"></i>
      <h6>{{ $t('upload_images.upload_image') }}</h6>
      <small v-if="props.fileType == 'pdf'">pdf</small>
      <small v-else-if="props.fileType == 'all'">pdf , png , jpeg</small>
      <small v-else>png , jpeg </small>
      <h6 class="browse_files">{{ $t('upload_images.browse_files') }}</h6>
    </label>
    <input 
      :id="props.id"
      type="file"
      @change="handleFileChange"
      :accept="props.fileType == 'pdf' ? '.pdf' : props.fileType == 'all' ? '.pdf, image/*' : '.png, .jpeg'"
      :multiple="props.inputType == 'multiple'"
      hidden
    >
    <div class="local_images" v-if="displayFiles.length > 0" :style="{ marginBottom: '30px' }">
      <div 
        class="image" 
        v-for="(file, index) in displayFiles" 
        :key="getFileKey(file, index)"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent 
        @drop.prevent="handleImageDrop($event, index)"
      >
        <div class="remove_btn" @click="emit('handleRemoveImage', index)">
          <button class="pi pi-trash"></button>
        </div>
        <template v-if="isPdf(file)">
          <NuxtLink :to="getFileUrl(file)" class="image pdf_image" download>
            <img src="/assets/images/pdf.png" alt="pdf" loading="lazy">
          </NuxtLink>
        </template>
        <template v-else>
          <Image  :src="getFileUrl(file)" alt="Image" preview />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
  // define global store
  const globalStore = useGlobalStore()

  // define toast messages
  const {
    showErrorToast
  } = useToastMsg()

  // define emits
  const emit = defineEmits(['handleUploadImages', 'handleRemoveImage', 'reorderImages']);

  const handleFileChange = (event) => {
    const files = event?.target?.files;
    if (files.length) {
      const validFiles = [];
      for (const file of files) {
        const fileType = file.type;
        if (fileType.startsWith('image/') || fileType.endsWith('pdf')) {
          validFiles.push(file);
        } else {
          showErrorToast(globalStore?.lang == 'ar' ? 'لا يمكن تحميل هذا النوع من الملفات' : 'You can not upload this type of files' );
        }
      }
      if (validFiles.length) {
        emit('handleUploadImages', validFiles);
      }
    }
  };

// define props
const props = defineProps({
  inputType: {
    type: String,
    default: ''
  },
  UploadedLocalFile: {
    type: [Array, String, Object],
    default: () => []
  },
  id: {
    type: String,
    default: 'images'
  },
  fileType : {
    type : String,
    default : 'image'
  }

});

// Computed property to normalize the files for display
const displayFiles = computed(() => {
  if (!props.UploadedLocalFile) return []
  
  // If it's a string (edit mode), wrap it in an array
  if (typeof props.UploadedLocalFile === 'string') {
    return [{ url: props.UploadedLocalFile }]
  }
  
  // If it's an array (add mode), return as is
  if (Array.isArray(props.UploadedLocalFile)) {
    return props.UploadedLocalFile
  }
  
  // If it's a single object (unlikely but possible)
  if (typeof props.UploadedLocalFile === 'object' && props.UploadedLocalFile !== null) {
    return [props.UploadedLocalFile]
  }
  
  return []
})

// Helper functions
const isPdf = (file) => {
  if (file.type) return file.type.endsWith('pdf')
  return file.url?.endsWith('.pdf') || false
}

const getFileUrl = (file) => {
  return file.url || file
}

const getFileKey = (file, index) => {
  return file.url || file.id || `file-${index}`
}

const dragOver = ref(false);
const draggedImageIndex = ref(null);

const handleDrop = (e) => {
  dragOver.value = false;
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    emit('handleUploadImages', files);
  }
};

const handleDragStart = (e, index) => {
  draggedImageIndex.value = index;
  e.dataTransfer.effectAllowed = 'move';
};

const handleImageDrop = (e, targetIndex) => {
  if (draggedImageIndex.value !== null && draggedImageIndex.value !== targetIndex) {
    emit('reorderImages', {
      from: draggedImageIndex.value,
      to: targetIndex
    });
  }
  draggedImageIndex.value = null;
};
</script>

<style lang="scss" scoped>
.upload-container {
  position: relative;
  transition: all 0.3s ease;

  &.drag-over {
    border: 2px dashed $mainColor;
    background-color: rgba(var(--primary-color-rgb), 0.6);
    border-radius: 8px;
    padding: 20px;
  }
}

.upload_image {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: $mainColor;
  }
}

.local_images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  .image {
    position: relative;
    display: block;
    width: 60px;
    height: 60px;
    // border: 1px solid #eee;
    transition: transform 0.2s ease;
    
    // &:hover {
      //   transform: scale(1.05);
      // }
      
      img {
      border-radius: 4px;
      overflow: hidden;
      object-fit: contain;
    }

    .remove_btn {
      position: absolute;
      top: -5px;
      right: -5px;
      background: $dangerColor;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      z-index: 1;

      button {
        color: white;
        font-size: 12px;
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
      }
    }
  }
}

  .browse_files{
    padding: 5px 8px;
    background: #fff;
    font-weight: 400;
    border-radius: 4px;
  }
</style>