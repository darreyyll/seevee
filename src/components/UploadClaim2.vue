<template>
  <body>
    <div id="dragapp" v-cloak @drop.prevent="addFile" @dragover.prevent>
  <h2> Drag Your Claim (JSON File) </h2>
  <ul>
    <li v-bind:key="file" v-for="file in files">
      {{ file.name }} ({{ file.size | kb }} kb) <button @click="removeFile(file)" title="Remove">X</button>
      <p v-if="booluploaded">
          <b> Your File's Contents: </b>
          {{fileText}}
          <br>
          <button v-on:click="submit"> Submit Claim </button>
      </p>
    </li>
  </ul>
  
  <button :disabled="uploadDisabled" @click="upload" v-if="!booluploaded" >Upload</button>
</div>
</body>
</template>

<script>
export default {
data() {
    return {
    files:[],
    fileContent: {},
    fileText: "",
    booluploaded: false
  }
},
computed: {
uploadDisabled() {
    return this.files.length === 0;
}
},
  methods:{
    submit() {
      this.$emit('submitted', this.fileContent)
    },
    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if(!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      ([...droppedFiles]).forEach(f => {
        this.files.push(f);
      });
    },
    removeFile(file){
      this.files = this.files.filter(f => {
        return f != file;
      });      
      this.booluploaded = false;
    },
    upload() {

      let formData = new FormData();
      
      this.files.forEach((f,x) => {
        formData.append('file'+(x+1), f);
      });
      console.log("FORM", formData);
      fetch('https://httpbin.org/post', {
        method:'POST',
        body: formData
      })
      .then(res => res.json())
      .then(res => {
         console.log('done uploading', res.files.file1);
        this.fileContent = JSON.parse(res.files.file1);
        this.fileText = JSON.stringify(this.fileContent);
        this.booluploaded = true;
        // Upload to FBase  
      })
      .catch(e => {
        console.error(JSON.stringify(e.message));
      });
      
      
    }
  }
}
</script>

<style>
#dragapp {
    background-color: #17a2b8;
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    height: 180px;
    width: 500px;
    margin: auto;
    
}

li {
    list-style-type: none;
}

#dragapp:-moz-drag-over {
    background-color: lightslategray;
}
</style>
