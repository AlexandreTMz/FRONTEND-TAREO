<template>
    <t-register-permission></t-register-permission>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TRegisterPermission from 'components/templates/RegisterPermission'
export default defineComponent({
    name:'PRegisterPermission',
    components:{
        TRegisterPermission
    },
    setup() {
        return{

        }
    },
})
</script>
