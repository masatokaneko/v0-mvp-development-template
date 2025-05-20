import { handleApiError, ValidationError, validateData, validators } from "@/lib/error-handler"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import jest from "jest" // Declare the jest variable

// NextResponseのモック
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({ body, options })),
  },
}))

describe("Error Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("handleApiError", () => {
    it("should handle Prisma known request errors", () => {
      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "4.0.0",
        meta: { target: ["email"] },
      })

      handleApiError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Unique Constraint Violation",
          message: "The email already exists.",
        },
        { status: 409 },
      )
    })

    it("should handle validation errors", () => {
      const error = new ValidationError("Validation failed", { name: "Name is required" })

      handleApiError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Validation Error",
          message: "Validation failed",
          fields: { name: "Name is required" },
        },
        { status: 400 },
      )
    })

    it("should handle general errors", () => {
      const error = new Error("Something went wrong")

      handleApiError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Internal Server Error",
          message: "Something went wrong",
        },
        { status: 500 },
      )
    })

    it("should handle unknown errors", () => {
      const error = "Not an error object"

      handleApiError(error)

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Unknown Error",
          message: "An unknown error occurred",
        },
        { status: 500 },
      )
    })
  })

  describe("validateData", () => {
    it("should validate data successfully", () => {
      const data = {
        name: "Test Name",
        email: "test@example.com",
        age: 25,
      }

      const schema = {
        name: validators.required("Name"),
        email: validators.isEmail("Email"),
        age: validators.isNumber("Age"),
      }

      expect(() => validateData(data, schema)).not.toThrow()
    })

    it("should throw ValidationError for invalid data", () => {
      const data = {
        name: "",
        email: "invalid-email",
        age: "not-a-number",
      }

      const schema = {
        name: validators.required("Name"),
        email: validators.isEmail("Email"),
        age: validators.isNumber("Age"),
      }

      expect(() => validateData(data, schema)).toThrow(ValidationError)
    })
  })

  describe("validators", () => {
    describe("required", () => {
      it("should validate required fields", () => {
        const validator = validators.required("Field")

        expect(validator("value")).toBe(true)
        expect(validator("")).toBe("Field is required")
        expect(validator(null)).toBe("Field is required")
        expect(validator(undefined)).toBe("Field is required")
      })
    })

    describe("minLength", () => {
      it("should validate minimum length", () => {
        const validator = validators.minLength("Field", 3)

        expect(validator("value")).toBe(true)
        expect(validator("va")).toBe("Field must be at least 3 characters")
      })
    })

    describe("isEmail", () => {
      it("should validate email format", () => {
        const validator = validators.isEmail("Email")

        expect(validator("test@example.com")).toBe(true)
        expect(validator("invalid-email")).toBe("Email must be a valid email address")
      })
    })

    describe("isNumber", () => {
      it("should validate numbers", () => {
        const validator = validators.isNumber("Number")

        expect(validator(123)).toBe(true)
        expect(validator("123")).toBe(true)
        expect(validator("abc")).toBe("Number must be a number")
      })
    })
  })
})
