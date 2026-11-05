import { useState } from 'react'
import gearIcon from '../assets/icon-gear.svg'
import type { OperatorInput } from '../data/DataContext'
import type { Operator } from '../data/types'
import { Field, FormModal, FormRow, FormSection, PrefixInput, TextInput } from './form/FormModal'

interface OperatorFormModalProps {
  operator?: Operator
  onSubmit: (input: OperatorInput) => void
  onCancel: () => void
}

export function OperatorFormModal({ operator, onSubmit, onCancel }: OperatorFormModalProps) {
  const isEdit = Boolean(operator)
  const [form, setForm] = useState<OperatorInput>({
    name: operator?.name ?? '',
    email: operator?.email ?? '',
    contact: operator?.contact.replace(/^\+63\s?/, '') ?? '',
  })
  const set = (key: keyof OperatorInput, value: string) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <FormModal
      title={isEdit ? 'Edit Operator Profile' : 'Add New Operator'}
      subtitle={isEdit ? `Update ${operator!.accountId}` : 'Register Operator'}
      icon={gearIcon}
      submitLabel={isEdit ? 'Save Changes' : 'Add Operator'}
      onCancel={onCancel}
      onSubmit={() => onSubmit({ ...form, contact: `+63 ${form.contact.trim()}` })}
    >
      <FormSection title="Operator Profile">
        <FormRow>
          <Field label="Full Name" htmlFor="operator-name" required>
            <TextInput
              id="operator-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Dela Cruz, Juan P."
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Email Address" htmlFor="operator-email" required>
            <TextInput
              id="operator-email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="name@example.com"
              required
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Contact Number" htmlFor="operator-contact" required>
            <PrefixInput
              id="operator-contact"
              prefix="+63"
              type="tel"
              value={form.contact}
              onChange={(e) => set('contact', e.target.value)}
              placeholder="912 345 6789"
              required
            />
          </Field>
          {operator && (
            <Field label="Account ID" htmlFor="operator-id">
              <TextInput id="operator-id" value={operator.accountId} readOnly />
            </Field>
          )}
        </FormRow>
      </FormSection>
    </FormModal>
  )
}
