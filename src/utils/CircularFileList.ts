/**
 * Implementation of a circular doubly linked list (CDLL) to store file paths.
 */
export class CircularFileList {
	private head: FileNode | null = null;
	private current: FileNode | null = null;

	push(filePath: string) {
		const newNode = new FileNode(filePath);

		if (!this.head) {
			// First node in the list
			this.head = newNode;
			this.head.next = this.head;
			this.head.prev = this.head;
			this.current = this.head;
		} else {
			// Insert at the end
			const tail = this.head.prev;
			if (tail) {
				tail.next = newNode;
				newNode.prev = tail;
				newNode.next = this.head;
				this.head.prev = newNode;
			}
		}
	}

	pop() {
		if (!this.current) return null;

		const removedFilePath = this.current.filePath;

		if (this.current === this.current.next) {
			// Only one element in the list
			this.head = null;
			this.current = null;
		} else {
			if (this.current.prev && this.current.next) {
				this.current.prev.next = this.current.next;
				this.current.next.prev = this.current.prev;
			}
			if (this.current === this.head) {
				this.head = this.current.next;
			}
			this.current = this.current.next;
		}

		return removedFilePath;
	}

	next() {
		if (this.current) this.current = this.current.next;
		return this.current?.filePath ?? null;
	}

	previous() {
		if (this.current) this.current = this.current.prev;
		return this.current?.filePath ?? null;
	}

	getCurrent() {
		return this.current?.filePath ?? null;
	}

	clear() {
		this.head = null;
		this.current = null;
	}
}

export class FileNode {
	filePath: string;
	next: FileNode | null = null;
	prev: FileNode | null = null;

	constructor(filePath: string) {
		this.filePath = filePath;
	}
}
