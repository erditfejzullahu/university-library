export const StatusErrors = [
    'UNKNOWN_ERROR',
    'USER_NOT_FOUND',
    'INTERNAL_SERVER_ERROR',
] as const;

export type StatusError = typeof StatusErrors[number];