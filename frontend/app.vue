<template>
    <div class="p-8 bg-gray-50 min-h-screen">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">API Validator Interface</h1>

            <div class="flex gap-2 mb-4">
                <input v-model="searchString" @keyup.enter="fetchProducts" type="text"
                    placeholder="Введите название или JSON-запрос..."
                    class="flex-1 p-2 border rounded shadow-sm font-mono text-sm" />
                <button @click="fetchProducts" :disabled="isLoading"
                    class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400">
                    {{ isLoading ? 'Проверка...' : 'Отправить' }}
                </button>
            </div>

            <div v-if="errorMessage"
                class="mb-8 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded text-sm">
                <strong>Результат:</strong> {{ errorMessage }}
            </div>

            <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="item in products" :key="item.id"
                    class="bg-white p-4 rounded shadow hover:shadow-md transition border border-gray-100">
                    <img :src="item.image_url" class="w-full h-48 object-cover mb-4 rounded bg-gray-100" />
                    <h3 class="font-semibold text-gray-800">{{ item.title }}</h3>
                    <p class="text-blue-600 font-bold mt-2">{{ item.price }} ₽</p>
                </div>
            </div>

            <div v-if="products.length === 0 && !isLoading && !errorMessage" class="text-center text-gray-400 mt-10">
                Введите данные для проверки связи с API
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product, SearchResponse } from './types/api'

const searchString = ref('')
const products = ref<Product[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

async function fetchProducts() {
    // Сбрасываем состояние перед новым запросом
    errorMessage.value = ''
    products.value = []
    isLoading.value = true

    const input = searchString.value.trim()
    let requestBody: any

    try {
        // ЛОГИКА ПРОВЕРКИ: Что ввел пользователь?
        if (input.startsWith('{')) {
            // Если ввод похож на JSON, пытаемся его распарсить
            try {
                requestBody = JSON.parse(input)
            } catch (e) {
                throw new Error('Некорректный формат JSON. Проверьте скобки и кавычки.')
            }
        } else {
            // Если обычная строка — упаковываем по стандарту
            requestBody = {
                filters: {
                    search_string: input,
                },
                paginate: { page: 1, pp_items: 15 }
            }
        }

        // Отправляем на твой сервер-валидатор (localhost:3000)
        const data = await $fetch<SearchResponse>('http://localhost:3000/api/products/search', {
            method: 'POST',
            body: requestBody
        })

        if (data && data.success) {
            products.value = data.data

            if (data.data.length === 0) {
                errorMessage.value = 'Сервер ответил успешно, но товаров по этому запросу нет.'
            }
        }
    } catch (e: any) {
        // Здесь мы ловим и ошибки парсинга JSON, и ошибки валидации от Zod (400 Bad Request)
        errorMessage.value = e.data?.message || e.message || 'Произошла ошибка при запросе'
        console.error('Ошибка:', e)
    } finally {
        isLoading.value = false
    }
}
</script>
