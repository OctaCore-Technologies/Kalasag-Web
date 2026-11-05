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

interface NameParts {
  first: string
  last: string
  middle: string
}

/** Operator names are stored as "Last, First M." to match the Operators table. */
function splitName(name: string): NameParts {
  const [last = '', rest = ''] = name.split(',').map((s) => s.trim())
  const match = rest.match(/^(.*?)\s+([A-Za-z])\.?$/)
  return match ? { last, first: match[1], middle: match[2] } : { last, first: rest, middle: '' }
}

function joinName({ first, last, middle }: NameParts) {
  return `${last.trim()}, ${first.trim()} ${middle.trim().toUpperCase()}.`
}

export function OperatorFormModal({ operator, onSubmit, onCancel }: OperatorFormModalProps) {
  const isEdit = Boolean(operator)
  const [name, setName] = useState<NameParts>(() => splitName(operator?.name ?? ''))
  const [email, setEmail] = useState(operator?.email ?? '')
  const [phone, setPhone] = useState(operator?.contact.replace(/^\+63\s?/, '') ?? '')
  const setPart = (key: keyof NameParts, value: string) => setName((n) => ({ ...n, [key]: value }))

  return (
    <FormModal
      title={isEdit ? 'Edit Operator Profile' : 'Create Operator Profile'}
      subtitle={isEdit ? 'Change Operator Details' : 'Add Operator Details'}
      icon={gearIcon}
      submitLabel={isEdit ? 'Save' : 'Create'}
      buttonShape="pill"
      onCancel={onCancel}
      onSubmit={() => onSubmit({ name: joinName(name), email: email.trim(), contact: `+63 ${phone.trim()}` })}
    >
      <FormSection title="Operator Profile">
        <FormRow columns={3}>
          <Field label="First Name" htmlFor="operator-first" required>
            <TextInput
              id="operator-first"
              value={name.first}
              onChange={(e) => setPart('first', e.target.value)}
              placeholder="Juan"
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Last Name" htmlFor="operator-last" required>
            <TextInput
              id="operator-last"
              value={name.last}
              onChange={(e) => setPart('last', e.target.value)}
              placeholder="Dela Cruz"
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Middle Initial" htmlFor="operator-middle" required>
            <TextInput
              id="operator-middle"
              value={name.middle}
              onChange={(e) => setPart('middle', e.target.value.replace(/[^A-Za-z]/g, ''))}
              placeholder="P"
              maxLength={1}
              required
              autoComplete="off"
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Email Address" htmlFor="operator-email" required>
            <TextInput
              id="operator-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </Field>
          <Field label="Phone Number" htmlFor="operator-phone" required>
            <PrefixInput
              id="operator-phone"
              prefix="+63"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="912-345-6789"
              required
            />
          </Field>
        </FormRow>
      </FormSection>
    </FormModal>
  )
}
