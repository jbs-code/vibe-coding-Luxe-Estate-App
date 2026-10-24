import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching property';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    // 1. Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!roleData || roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Parse body
    const body = await request.json();
    const {
      title,
      price,
      pricePeriod,
      address,
      location,
      beds,
      baths,
      area,
      images,
      type,
      status,
      isFeatured,
      tag,
      description,
      amenities,
      garage,
      latitude,
      longitude,
      agentName,
      agentAvatar,
      agentPhone,
      agentEmail,
      agentTitle,
    } = body;

    const numericPrice = Number(price);
    const formattedPrice = `$${numericPrice.toLocaleString('en-US')}`;

    const updatePayload: Record<string, unknown> = {
      title,
      price: numericPrice,
      price_formatted: formattedPrice,
      price_period: status === 'rent' ? (pricePeriod || '/mo') : null,
      address,
      location,
      beds: Number(beds) || 1,
      baths: Number(baths) || 1,
      area: area || '200 m²',
      type: type || 'house',
      status: status || 'sale',
      is_featured: Boolean(isFeatured),
      tag: tag || null,
      description: description || '',
      amenities: Array.isArray(amenities) ? amenities : [],
      garage: Number(garage) || 1,
      latitude: Number(latitude) || 37.4419,
      longitude: Number(longitude) || -122.143,
      agent_name: agentName || 'Sarah Jenkins',
      agent_avatar: agentAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w',
      agent_phone: agentPhone || '+1 (555) 349-8200',
      agent_email: agentEmail || 'sarah.jenkins@luxeestate.com',
      agent_title: agentTitle || 'Top Rated Luxury Agent',
    };

    if (Array.isArray(images) && images.length > 0) {
      updatePayload.image_url = images;
      updatePayload.image_alt = title;
    }

    const { data: updated, error: updateError } = await supabase
      .from('properties')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[Properties API] Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (err: unknown) {
    console.error('[Properties API] Update error:', err);
    const message = err instanceof Error ? err.message : 'Error actualizando propiedad';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    // 1. Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!roleData || roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[Properties API] Delete error:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    console.error('[Properties API] Delete error:', err);
    const message = err instanceof Error ? err.message : 'Error eliminando propiedad';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
