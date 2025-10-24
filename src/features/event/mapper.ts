export type EventFormValues = {
    name: string;
    description: string;
    direction: string;
    date: string;
    latitude?: string | number;
    longitude?: string | number;
    finished?: boolean;
}

function ensureDateYYYYMMDD(d: string){
    const dt = new Date(d);
    if(Number.isNaN(dt.getTime())) return d;
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function formValuesToDto(values: EventFormValues) {
    return {
        name: values.name?.trim(),
        description: values.description?.trim(),
        direction: values.direction?.trim(),
        date: ensureDateYYYYMMDD(values.date),
        latitude: values.latitude !== undefined && values.latitude !== '' ? Number(values.latitude) : null, 
        longitude: values.longitude !== undefined && values.longitude !== '' ? Number(values.longitude) : null,
        /* idOrganization: opts?.idOrganization ?? null,
        idOrganizer: opts?.idOrganizer ?? null, */
        finished: !!values.finished,

    }as Partial<import ("../../types/event").EventDto>;
} 