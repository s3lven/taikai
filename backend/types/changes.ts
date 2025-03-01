export type ChangeEntityType = 'bracket' | 'participant' | 'matches'
export type ChangeType = 'create' | 'update' | 'delete'

export interface Change {
    entityType: ChangeEntityType,
    changeType: ChangeType,
    entityId: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any // TODO: define this type?
    timestamp: number
}