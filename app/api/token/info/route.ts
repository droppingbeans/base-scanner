import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Token address required' },
      { status: 400 }
    );
  }

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid address format' },
      { status: 400 }
    );
  }

  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'token-info-json.sh');
    const { stdout, stderr } = await execAsync(`${scriptPath} ${address}`);
    
    if (stderr && !stdout) {
      return NextResponse.json(
        { error: 'Failed to fetch token info', details: stderr },
        { status: 500 }
      );
    }

    // Parse the output (assuming JSON output from script)
    try {
      const data = JSON.parse(stdout);
      return NextResponse.json(data);
    } catch {
      // If not JSON, return as text
      return NextResponse.json({
        address,
        raw: stdout,
      });
    }
  } catch (error: any) {
    console.error('Token info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token info', details: error.message },
      { status: 500 }
    );
  }
}
