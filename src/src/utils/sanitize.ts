const _escDiv = document.createElement('div')

export function escapeHtml(unsafe: unknown): string {
    if (unsafe === null || unsafe === undefined) return ''
    _escDiv.textContent = String(unsafe)
    return _escDiv.innerHTML
}

export function sanitizeColor(value: unknown): string {
    const str = String(value ?? '')
    if (/^#?[0-9a-fA-F]{3,8}$/.test(str)) return str
    return ''
}

export function sanitizeFileName(value: unknown): string {
    return String(value ?? '').replace(/[<>"'&\\\/]/g, '')
}
