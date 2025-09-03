import { formSchema } from '@/lib/validation';

describe('Form Validation Schema', () => {
  describe('firstName validation', () => {
    it('should accept valid first names', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).not.toThrow();
    });

    it('should reject empty first name', () => {
      expect(() => formSchema.parse({
        firstName: '',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).toThrow('First name is required');
    });

    it('should reject first name longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => formSchema.parse({
        firstName: longName,
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).toThrow('First name must be 50 characters or less');
    });
  });

  describe('lastName validation', () => {
    it('should accept valid last names', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).not.toThrow();
    });

    it('should reject empty last name', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: '',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).toThrow('Last name is required');
    });

    it('should reject last name longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: longName,
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).toThrow('Last name must be 50 characters or less');
    });
  });

  describe('phone validation', () => {
    it('should accept valid phone numbers', () => {
      const validPhones = [
        '+11234567890',
        '+12345678901',
        '+19876543210'
      ];

      validPhones.forEach(phone => {
        expect(() => formSchema.parse({
          firstName: 'John',
          lastName: 'Doe',
          phone,
          corporationNumber: '123456789'
        })).not.toThrow();
      });
    });

    it('should reject empty phone number', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        corporationNumber: '123456789'
      })).toThrow('Phone number is required');
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '1234567890',      // Missing +1 prefix
        '+123456789',      // Too short
        '+123456789012',   // Too long
        'abc1234567890',   // Contains letters
        '+21234567890',    // Wrong country code
      ];

      invalidPhones.forEach(phone => {
        expect(() => formSchema.parse({
          firstName: 'John',
          lastName: 'Doe',
          phone,
          corporationNumber: '123456789'
        })).toThrow();
      });
    });
  });

  describe('corporationNumber validation', () => {
    it('should accept valid corporation numbers', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      })).not.toThrow();
    });

    it('should reject empty corporation number', () => {
      expect(() => formSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: ''
      })).toThrow('Corporation number is required');
    });

    it('should reject corporation numbers with wrong length', () => {
      const invalidNumbers = [
        '12345678',      // Too short
        '1234567890',    // Too long
        'abcdefghi',     // Letters
        '12345678a',     // Mixed
      ];

      invalidNumbers.forEach(corporationNumber => {
        expect(() => formSchema.parse({
          firstName: 'John',
          lastName: 'Doe',
          phone: '+11234567890',
          corporationNumber
        })).toThrow();
      });
    });
  });

  describe('complete form validation', () => {
    it('should validate complete valid form', () => {
      const validForm = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+11234567890',
        corporationNumber: '123456789'
      };

      const result = formSchema.safeParse(validForm);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validForm);
      }
    });

    it('should return all validation errors for invalid form', () => {
      const invalidForm = {
        firstName: '',
        lastName: '',
        phone: '',
        corporationNumber: ''
      };

      const result = formSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(4);
        const messages = result.error.issues.map(issue => issue.message);
        expect(messages).toContain('First name is required');
        expect(messages).toContain('Last name is required');
        expect(messages).toContain('Phone number is required');
        expect(messages).toContain('Corporation number is required');
      }
    });
  });
});
