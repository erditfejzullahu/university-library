"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import {z, ZodType} from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";

interface Props<T extends FieldValues>{
    schema: ZodType<T>,
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean; error?:string}>;
    type: "SIGN_IN" | "SIGN_UP"
}

const AuthForm = <T extends FieldValues>({type, schema, defaultValues, onSubmit}: Props<T>) => {
    const isSignedIn = type === "SIGN_IN"
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSubmit: SubmitHandler<T> = async (data) => {};

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">
            {isSignedIn ? "Mire se vini tek ShokuLibrit" : "Krijoni nje llogari personale"}
        </h1>
        <p className="text-light-100">
            {isSignedIn ? "Krijoni dituri te medha nga shfletimi i librave e-book falas!" : "Ju lutem mbushini te gjitha fushat dhe pastaj aplikoni!"}
        </p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">

                {Object.keys(defaultValues).map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                                    <FormControl>
                                        {field.name === 'universityCard' ? ( <ImageUpload onFileChange={field.onChange} /> ) : (
                                            <Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} className="form-input" />
                                        )}
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    >
                    </FormField>
                ))}
                <Button className="form-btn" type="submit">{isSignedIn ? "Kycuni" : "Krijoni llogarine"}</Button>
            </form>
        </Form>
        <p className="text-center text-base font-medium">
            {isSignedIn ? "I/E re tek ShokuLibrit?" : "Keni nje llogari?"}
            <Link className="text-primary font-bold" href={isSignedIn ? "/sign-up" : "/sign-in"}>{isSignedIn ? " Krijo nje llogari" : " Kucuni"}</Link>
        </p>
    </div>
  )
}

export default AuthForm