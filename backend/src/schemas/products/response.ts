import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number().describe('Уникальный идентификатор товара'),
    title: z.string().describe('Название изделия'),
    price: z.number().describe('Цена в базовой валюте'),
    image_url: z.string().url().describe('Ссылка на главное изображение'),
    article: z.string().optional().describe('Артикул товара'),
    in_stock: z.boolean().describe('Наличие на складе'),
    rating: z.number().min(0).max(5).optional().describe('Средний рейтинг'),
}).describe('Модель товара');

export const ProductSearchResponseSchema = z.object({
    success: z.boolean().describe('Статус выполнения запроса'),
    data: z.array(ProductSchema).describe('Список найденных продуктов'),
    total: z.number().describe('Общее количество найденных позиций для пагинации'),
});