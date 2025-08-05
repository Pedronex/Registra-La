import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'registers',
            columns: [
                { name: 'type', type: 'string' },
                { name: 'time', type: 'string', isOptional: true },
                { name: 'date', type: 'string' },
                { name: 'photo', type: 'string', isOptional: true },
                { name: 'location', type: 'string', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'nsr', type: 'string', isOptional: true },
                { name: 'is_full_day', type: 'boolean' },

                { name: 'start_time', type: 'string', isOptional: true },
                { name: 'end_time', type: 'string', isOptional: true },
                { name: 'duration', type: 'number', isOptional: true },
                { name: 'operation', type: 'string', isOptional: true },

                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'config',
            columns: [
                { name: 'work_hours', type: 'number' },
                { name: 'tolerance', type: 'number', isOptional: true },
            ],
        })
    ],
});
