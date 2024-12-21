export type ChangeEntityType = 'tournament' | 'bracket' | 'participants'
export type ChangeType = 'create' | 'update' | 'delete' | 'move' | 'shuffle'

export interface Change {
    entityType: ChangeEntityType,
    changeType: ChangeType,
    entityId: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any // TODO: define this type?
    timestamp: number
}