"use server";

import { API_BASE_URL } from "@/lib/enviroment";
import { ApiResponse } from "../types/form";
import { EnquiryFormData } from "../types/form";

export async function submitEnquiry(
  data: EnquiryFormData
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/school-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        submittedAt: new Date().toISOString(),
      }),
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    return {
      success: true,
      message: "Enquiry submitted successfully! We will contact you soon.",
      data: result,
    };
  } catch (error) {
    console.error("Failed to submit enquiry:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit enquiry. Please try again.",
    };
  }
}
