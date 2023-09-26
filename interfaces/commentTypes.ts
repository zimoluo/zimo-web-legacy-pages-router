interface ReplyProps {
    from: string;
    to?: string; // 'to' property may not exist, so it's marked as optional.
    content: string;
    date: string;
}

interface ReplyBoxProps {
    from: string;
    to?: string; // 'to' property may not exist, so it's marked as optional.
    content: string;
}

interface CommentEntry {
    author: string;
    date: string;
    content: string;
    replies?: ReplyProps[];
    likedBy: string[];
}
