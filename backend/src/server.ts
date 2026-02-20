import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ProductSearchRequestSchema } from './schemas/products/request';
import { ProductSearchResponseSchema } from './schemas/products/response';

const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

// Настройка Zod провайдера
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

async function run() {

    await server.register(cors, {
        origin: true // Разрешаем всем (для тестов)
    })

    // Регистрация Swagger
    await server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Art Accessories API',
                description: 'Интерактивная документация для поиска товаров',
                version: '1.0.0',
            },
            servers: [{ url: 'http://localhost:3000' }],
        },
        transform: jsonSchemaTransform,
    });

    // Регистрация UI для Swagger
    await server.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
    });

    // ProductSearch
    server.post('/api/products/search', {
        schema: {
            tags: ['Products'],
            summary: 'Поиск товаров по фильтрам',
            body: ProductSearchRequestSchema,
            response: {
                200: ProductSearchResponseSchema,
                500: z.object({
                    success: z.literal(false),
                    error: z.string()
                })
            }
        }
    }, async (request, reply) => {
        try {
            // Имитация запроса к серверу
            // Использование данных которые пришли в request.body
            const response = await fetch('https://main.nointerest.ru/api/products/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request.body)
            });

            const realData = await response.json();

            // Возврат данных
            return {
                success: true,
                data: realData.products || [], // подстрой под их реальный ключ в JSON
                total: realData.total || 0
            };
        } catch (error) {
            return reply.status(500).send({ success: false, error: 'Internal Server Error' });
        }
    });

    await server.listen({ port: 3000 });
    console.log('Документация доступна по адресу: http://localhost:3000/documentation');
}

run();