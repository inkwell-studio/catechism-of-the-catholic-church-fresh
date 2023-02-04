/**
 * TODO: Finish explanation (include note about retrieving the parent node `pathID` value by truncating the child `pathID` value)
 * This is used to identify the nodes
 * TODO: Add a note about `0` being the sentinal value for the "front page"/"book cover" of the Catechism
 */
export type PathID =
    | `${number}`
    | `${number}-${number}`
    | `${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}`
    | `${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}-${number}`;
