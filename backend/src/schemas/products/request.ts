import { z } from 'zod';

// Схема для пагинации
const PaginationSchema = z.object({
    page: z.number().min(1).default(1).describe('Текущая страница'),
    pp_items: z.number().min(1).max(100).default(15).describe('Количество элементов на странице'),
});

// Основные фильтры поиска
const FilterSchema = z.object({
    search_string: z.string().optional().describe('Поиск по названию или описанию'),
    price_from: z.string().optional().describe('Минимальная цена'),
    price_to: z.string().optional().describe('Максимальная цена'),
    price_currency: z.string().optional().default('RUB').describe('Валюта поиска'),

    // Категории и группы
    categories: z.array(z.string()).optional().describe('Массив ID категорий'),
    product_group: z.array(z.string()).optional().describe('Группы товаров'),

    // Рейтинг и владельцы
    avg_raiting_from: z.string().optional().describe('Минимальный средний рейтинг'),
    product_owner: z.array(z.string()).optional().describe('ID владельцев (брендов)'),
    product_owner_name: z.string().optional().describe('Имя владельца товара'),
    product_manufacture: z.array(z.string()).optional().describe('Производители'),

    // Технические поля
    id: z.string().optional().describe('Поиск по конкретному ID'),
    id_in: z.string().optional().describe('Список ID через запятую'),
    is_related_for: z.string().optional().describe('Связанные товары для ID'),
    subscription_exists: z.string().optional().describe('Наличие подписки (true/false)'),
    from_modal: z.string().optional().describe('Флаг вызова из модального окна'),
    ordering: z.string().optional().describe('Направление сортировки'),

    // Динамические варианты
    variant_1: z.array(z.any()).optional(),
    variant_3: z.array(z.any()).optional(),
    variant_4: z.array(z.any()).optional(),
    variant_13: z.array(z.any()).optional(),
    variant_24: z.array(z.any()).optional(),
    variant_25: z.array(z.any()).optional(),
});

// Финальный обЪект запроса для Swagger
export const ProductSearchRequestSchema = z.object({
    filters: FilterSchema,
    paginate: PaginationSchema,
});

export type ProductSearchRequest = z.infer<typeof ProductSearchRequestSchema>;


