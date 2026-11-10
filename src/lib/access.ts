import type { Access, FieldAccess } from 'payload'
export const manageContent: Access = ({ req }) => ['owner', 'editor'].includes(String(req.user?.role))
export const manageLeads: Access = ({ req }) => ['owner', 'inquiry_manager'].includes(String(req.user?.role))
export const ownerOnly: Access = ({ req }) => req.user?.role === 'owner'
export const privateContent: FieldAccess = ({ req }) => ['owner', 'editor'].includes(String(req.user?.role))
