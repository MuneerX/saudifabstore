import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
    const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;
    const USE_UPLOADCARE = process.env.USE_UPLOADCARE === 'true';

    // Test basic connectivity to Uploadcare REST API
    const testResponse = await fetch('https://api.uploadcare.com/project/', {
      method: 'GET',
      headers: {
        'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        'Accept': 'application/vnd.uploadcare-v0.7+json',
      },
    });

    const isConnected = testResponse.ok;
    const projectData = isConnected ? await testResponse.json() : null;

    return NextResponse.json({
      message: 'Uploadcare CDN connection test',
      status: isConnected ? 'success' : 'failed',
      uploadcare_enabled: USE_UPLOADCARE,
      public_key_configured: !!UPLOADCARE_PUBLIC_KEY,
      secret_key_configured: !!UPLOADCARE_SECRET_KEY,
      projectName: projectData?.name || 'brooqalkhalij',
      autostoreEnabled: projectData?.autostore_enabled ?? true,
      api_response_status: testResponse.status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Uploadcare test failed:', error);
    return NextResponse.json({
      message: 'Uploadcare connection test failed',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      uploadcare_enabled: process.env.USE_UPLOADCARE === 'true',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}