import { useState } from 'react'
import gearIcon from '../assets/icon-gear.svg'
import calendarIcon from '../assets/icon-calendar.svg'
import type { DeviceInput } from '../data/DataContext'
import type { Device, DeviceType } from '../data/types'
import { PinpointMap } from './PinpointMap'
import {
  Divider,
  Field,
  FormModal,
  FormRow,
  FormSection,
  IconInput,
  PrefixInput,
  SelectInput,
  TextArea,
  TextInput,
} from './form/FormModal'

interface DeviceFormModalProps {
  device?: Device
  onSubmit: (input: DeviceInput) => void
  onCancel: () => void
}

const EMPTY: DeviceInput = {
  type: 'Distress Node',
  residentName: '',
  birthDate: '',
  address: '',
  phone: '',
  email: '',
}

export function DeviceFormModal({ device, onSubmit, onCancel }: DeviceFormModalProps) {
  const isEdit = Boolean(device)
  const [form, setForm] = useState<DeviceInput>(() =>
    device
      ? {
          type: device.type,
          residentName: device.residentName === '—' ? '' : device.residentName,
          birthDate: device.birthDate,
          address: device.address,
          phone: device.phone,
          email: device.email,
          location: device.location,
        }
      : EMPTY,
  )
  const isNode = form.type === 'Distress Node'
  const set = <K extends keyof DeviceInput>(key: K, value: DeviceInput[K]) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <FormModal
      title={isEdit ? 'Edit Device Info' : 'Add New Device'}
      subtitle={isEdit ? 'Change Device Details' : 'Register Device'}
      icon={gearIcon}
      submitLabel={isEdit ? 'Save Changes' : 'Add Device'}
      onCancel={onCancel}
      onSubmit={() => onSubmit({ ...form, residentName: form.residentName || '—' })}
    >
      <FormSection title="Resident Profile">
        <FormRow>
          <Field label="Full Name" htmlFor="device-name" required={isNode}>
            <TextInput
              id="device-name"
              value={form.residentName}
              onChange={(e) => set('residentName', e.target.value)}
              placeholder="Juan Dela Cruz"
              required={isNode}
              autoComplete="off"
            />
          </Field>
          <Field label="Date of Birth" htmlFor="device-dob" required={isNode}>
            <IconInput
              id="device-dob"
              icon={calendarIcon}
              type="date"
              value={form.birthDate}
              onChange={(e) => set('birthDate', e.target.value)}
              required={isNode}
            />
          </Field>
        </FormRow>
        <Field label="Pinpoint Location" htmlFor="device-address" required>
          <TextArea
            id="device-address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="House no., street, barangay, city, province, ZIP"
            required
          />
        </Field>
        <FormRow>
          <Field label="Phone Number" htmlFor="device-phone" required={isNode}>
            <PrefixInput
              id="device-phone"
              prefix="+63"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="912-345-6789"
              required={isNode}
            />
          </Field>
          <Field label="Email Address" htmlFor="device-email" required={isNode}>
            <TextInput
              id="device-email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="name@example.com"
              required={isNode}
            />
          </Field>
        </FormRow>
      </FormSection>

      <Divider />

      <FormSection title="Device Information">
        <Field label="Device Type" htmlFor="device-type" required>
          <SelectInput id="device-type" value={form.type} onChange={(e) => set('type', e.target.value as DeviceType)}>
            <option>Distress Node</option>
            <option>Relay Tower</option>
          </SelectInput>
        </Field>
      </FormSection>

      <Divider />

      <PinpointMap />
    </FormModal>
  )
}
