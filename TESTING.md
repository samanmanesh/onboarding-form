# Testing Documentation

## Overview

This project includes comprehensive automated integration tests for the essential parts of the onboarding form using React Testing Library.

## Test Setup

### Configuration
- **Jest Configuration**: `jest.config.js` with Next.js integration
- **Test Environment**: jsdom for DOM simulation  
- **Setup File**: `jest.setup.js` with necessary mocks and polyfills

### Dependencies
- `@testing-library/react` - Component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jest` - Test runner
- `jest-environment-jsdom` - DOM environment

## Test Structure

### Test Files
1. **`__tests__/lib/validation.test.ts`** - Unit tests for form validation schema
2. **`__tests__/OnboardingForm.essential.test.tsx`** - Integration tests for essential functionality
3. **`__tests__/utils/test-utils.tsx`** - Test utilities and React Query setup

## Essential Parts Covered

### ✅ Form Validation
- **Required field validation** - Ensures all fields show appropriate errors when empty
- **Field error clearing** - Validates that errors disappear when user starts typing
- **Input constraints** - Tests length limits and format enforcement (names, phone, corporation number)

### ✅ Corporation Number Validation  
- **Loading states** - Verifies loading indicator appears during API validation
- **Invalid corporation handling** - Tests error display for invalid corporation numbers
- **API integration** - Mocks and tests actual API calls

### ✅ Form Submission
- **Successful submission** - Tests complete form submission flow with valid data
- **Error handling** - Verifies proper display of submission errors
- **Invalid data prevention** - Ensures forms with invalid corporation numbers cannot be submitted

### ✅ User Experience
- **Loading states** - Tests button disable/enable states during submission
- **Accessibility** - Validates ARIA attributes and proper form structure
- **Form reset** - Tests the "Try again" functionality after successful submission

### ✅ Input Validation Schema
- **Field-level validation** - Individual field validation rules
- **Format validation** - Phone number and corporation number format requirements  
- **Length constraints** - Maximum character limits for all fields
- **Complete form validation** - End-to-end validation flow

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Files
```bash
npm test -- __tests__/OnboardingForm.essential.test.tsx
npm test -- __tests__/lib/validation.test.ts
```

### Watch Mode
```bash
npm run test:watch
```

## Test Coverage

The tests cover the critical user flows and validation logic:

1. **User Input Validation** - All form fields are properly validated
2. **API Integration** - Corporation validation API is properly mocked and tested
3. **Error Handling** - Both client and server errors are handled gracefully  
4. **User Feedback** - Loading states and success/error messages are displayed
5. **Accessibility** - Form is accessible with proper ARIA attributes

## Key Testing Patterns

### API Mocking
```javascript
jest.mock('../lib/api');
const mockApi = api as jest.Mocked<typeof api>;

mockApi.validateCorporationNumber.mockResolvedValue({
  valid: true,
  message: 'Valid corporation'
});
```

### User Interaction Testing
```javascript
const user = userEvent.setup();
await user.type(screen.getByLabelText(/first name/i), 'John');
await user.click(screen.getByRole('button', { name: /submit/i }));
```

### Async Testing with React Query
```javascript
await waitFor(() => {
  expect(mockApi.validateCorporationNumber).toHaveBeenCalledWith('123456789');
});
```

## Benefits

1. **Confidence in Core Functionality** - Essential user flows are thoroughly tested
2. **Regression Prevention** - Tests catch breaking changes early
3. **Documentation** - Tests serve as living documentation of expected behavior
4. **Maintainability** - Changes can be made safely with test verification

## Test Quality

- **Realistic User Interactions** - Tests simulate actual user behavior
- **Proper Async Handling** - Correctly tests async operations like API calls
- **Accessibility Focus** - Validates proper ARIA attributes and screen reader support
- **Error Boundary Testing** - Tests both happy path and error scenarios

The test suite provides comprehensive coverage of the essential functionality while maintaining fast execution and reliable results.
