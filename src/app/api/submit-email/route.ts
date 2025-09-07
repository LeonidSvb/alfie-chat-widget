import { NextRequest, NextResponse } from 'next/server';
import { EmailSubmissionData, CRMSubmissionResponse } from '@/types/crm';
import { ghlClient, GoHighLevelContact } from '@/lib/gohighlevel';

export async function POST(request: NextRequest): Promise<NextResponse<CRMSubmissionResponse>> {
  try {
    const body = await request.json() as EmailSubmissionData;

    // Validate required fields
    if (!body.email || !body.questionnaireSummary || !body.flowType || !body.tripGuideId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: email, questionnaireSummary, flowType, or tripGuideId'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Map questionnaire data to GoHighLevel custom fields
    const questionnaire = body.questionnaireSummary;
    
    // Extract and map fields based on common questionnaire structure - ensure all fields have values
    const placeOfInterest = 
      questionnaire.regions_interest || 
      questionnaire.destination_main || 
      questionnaire.destination || 
      'Not specified';

    const travelerType = 
      questionnaire.party_type || 
      questionnaire.party_type_shared ||
      questionnaire.travel_party || 
      'Not specified';

    const activityLevel = 
      questionnaire.fitness_level || 
      questionnaire.fitness_level_shared ||
      questionnaire.activity_level || 
      'Not specified';

    // Serialize activity arrays - include all possible activity fields, ensure always populated
    const activityPreferences = questionnaire.activities_interest || questionnaire.activities
      ? JSON.stringify(Array.isArray(questionnaire.activities_interest || questionnaire.activities) 
          ? (questionnaire.activities_interest || questionnaire.activities)
          : [questionnaire.activities_interest || questionnaire.activities])
      : 'Not specified';

    // Include travel_style and guided preferences, ensure always populated
    const guidedPreferences = 
      questionnaire.guided_preference || 
      questionnaire.guided_prefs || 
      questionnaire.travel_style
      ? JSON.stringify(Array.isArray(questionnaire.guided_preference || questionnaire.guided_prefs) 
          ? (questionnaire.guided_preference || questionnaire.guided_prefs)
          : [questionnaire.guided_preference || questionnaire.guided_prefs || questionnaire.travel_style])
      : 'Not specified';

    const travelBudget = questionnaire.budget || questionnaire.budget_range || 'Not specified';
    const travelDates = questionnaire.travel_dates || questionnaire.when_travel || questionnaire.season_window_shared || 'Not specified';

    // Create GoHighLevel contact with only required fields
    const contact: GoHighLevelContact = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      customFields: {
        planning_stage: body.flowType,
        place_of_interest: placeOfInterest,
        traveler_type: travelerType,
        activity_level: activityLevel,
        activity_preferences: activityPreferences,
        guided_preferences: guidedPreferences,
        travel_budget: travelBudget,
        travel_dates: travelDates,
        full_survey_data: JSON.stringify(questionnaire)
      }
    };

    const result = await ghlClient.createContact(contact);

    if (!result.success) {
      console.error('GoHighLevel contact creation failed:', result);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save contact information. Please try again.'
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      contactId: result.id,
      message: 'Email submitted successfully and trip guide unlocked!'
    });

  } catch (error) {
    console.error('Email submission API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}