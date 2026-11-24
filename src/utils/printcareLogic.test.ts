import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildZipBytes,
  extractInitials,
  filterCustomers,
  isoDateToDisplay,
  validateAddress,
  validateConfirmPassword,
  validateCustomerName,
  validateDob,
  validateEmail,
  validateIndianPhone,
  validatePassword,
  type CustomerRecord,
} from './printcareLogic';

test('Indian phone validation accepts valid 10-digit numbers starting with 6-9', () => {
  assert.equal(validateIndianPhone('9876543210'), null);
  assert.equal(validateIndianPhone('6123456789'), null);
  assert.ok(validateIndianPhone('5876543210') !== null);
  assert.ok(validateIndianPhone('98765') !== null);
  assert.ok(validateIndianPhone('') !== null);
});

test('Email, password, name, DOB, and address validators enforce rules', () => {
  assert.equal(validateEmail('aarav.sharma@example.in'), null);
  assert.ok(validateEmail('not-an-email') !== null);

  assert.equal(validatePassword('secret123'), null);
  assert.ok(validatePassword('123') !== null);

  assert.equal(validateConfirmPassword('secret123', 'secret123'), null);
  assert.ok(validateConfirmPassword('secret123', 'mismatch') !== null);

  assert.equal(validateCustomerName('Priya Deshmukh'), null);
  assert.ok(validateCustomerName('A') !== null);

  assert.equal(validateDob('14/08/1994'), null);
  assert.ok(validateDob('1994-08-14') !== null);

  assert.equal(validateAddress('204 Shastri Nagar, Pune 411006'), null);
  assert.ok(validateAddress('Pune') !== null);
});

test('Customer filter matches by name or phone number', () => {
  const list: CustomerRecord[] = [
    {
      customerId: 'CUST-001',
      name: 'Rohan Kulkarni',
      phone: '9823411220',
      dob: '12/04/1991',
      email: 'rohan@example.in',
      address: 'Kothrud, Pune',
      createdAt: '2026-11-10T10:00:00Z',
    },
    {
      customerId: 'CUST-002',
      name: 'Meera Nair',
      phone: '9447122334',
      dob: '23/09/1996',
      email: 'meera@example.in',
      address: 'Indiranagar, Bengaluru',
      createdAt: '2026-11-11T10:00:00Z',
    },
  ];

  assert.equal(filterCustomers(list, '').length, 2);
  assert.equal(filterCustomers(list, 'rohan').length, 1);
  assert.equal(filterCustomers(list, '94471').length, 1);
  assert.equal(filterCustomers(list, 'unknown').length, 0);
});

test('extractInitials and isoDateToDisplay format correctly', () => {
  assert.equal(extractInitials('Aarav Mehta'), 'AM');
  assert.equal(extractInitials('Kavita'), 'KA');
  assert.equal(isoDateToDisplay('1995-03-18'), '18/03/1995');
});

test('buildZipBytes outputs valid PKZip header signature', () => {
  const zip = buildZipBytes([
    { path: 'PrintCare/README.txt', content: 'Hello PrintCare' },
  ]);
  assert.equal(zip[0], 0x50); // P
  assert.equal(zip[1], 0x4b); // K
  assert.equal(zip[2], 0x03);
  assert.equal(zip[3], 0x04);
});
