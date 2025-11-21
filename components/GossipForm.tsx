'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import { useMapContext } from '../context/MapContext';
import { useGossipContext } from '../context/GossipContext';

const formSchema = z.object({
    title: z
        .string()
        .min(5, 'El título del chisme debe tener al menos 5 caracteres.')
        .max(32, 'El título del chisme debe tener como máximo 32 caracteres.'),
    description: z
        .string()
        .min(10, 'La descripción debe tener al menos 10 caracteres.')
        .max(100, 'La descripción debe tener como máximo 100 caracteres.'),
});

export function GossipForm() {
    const { newPosition, setNewPosition } = useMapContext();
    const { createGossip } = useGossipContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        createGossip({
            title: data.title,
            description: data.description,
            location: {
                x: newPosition ? newPosition[0] : 0,
                y: newPosition ? newPosition[1] : 0,
            },
        });
        form.reset();
    }

    return (
        <Card className="w-full sm:max-w-md relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    setNewPosition(undefined);
                }}
            >
                <X className="h-4 w-4" />
            </Button>
            <CardHeader>
                <CardTitle>Nuevo Chisme</CardTitle>
                <CardDescription>Aquí puedes compartir un nuevo chisme.</CardDescription>
            </CardHeader>
            <CardContent className="mt-0">
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Título del Chisme
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Titulo del Chisme"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description">
                                        Descripcion
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="Describe el chisme con todo detalle..."
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/100 caracteres
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="submit" form="form-rhf-demo" className="w-full cursor-pointer">
                        Enviar Chisme
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}
