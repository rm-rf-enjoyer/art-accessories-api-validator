<script setup lang="ts">
import { ref } from 'vue'
import type { Product, SearchResponse } from './types/api'

const searchString = ref('')
const products = ref<Product[]>([])
const isLoading = ref(false)

async function fetchProducts() {
    isLoading.value = true
    try {
        const data = await $fetch<SearchResponse>('http://localhost:3000/api/products/search', {
            method: 'POST',
            body: {
                filters: {
                    search_string: searchString.value,
                },
                paginate: { page: 1, pp_items: 15 }
            }
        })
        products.value = data.data
    } catch (e) {
        console.error('Ошибка поиска', e)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="p-8 bg-gray-50 min-h-screen">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">(Test Task)</h1>

            <div class="flex gap-2 mb-8">
                <input v-model="searchString" type="text" placeholder="Начните вводить название..."
                    class="flex-1 p-2 border rounded shadow-sm" />
                <button @click="fetchProducts"
                    class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    {{ isLoading ? 'Загрузка...' : 'Найти' }}
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="item in products" :key="item.id"
                    class="bg-white p-4 rounded shadow hover:shadow-md transition">
                    <img :src="item.image_url" class="w-full h-48 object-cover mb-4 rounded" />
                    <h3 class="font-semibold">{{ item.title }}</h3>
                    <p class="text-blue-600 font-bold">{{ item.price }} ₽</p>
                </div>
            </div>

            <div v-if="products.length === 0 && !isLoading" class="text-center text-gray-500 mt-10">
                Товары не найдены. Попробуйте изменить запрос.
            </div>
        </div>
    </div>
</template>