import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function POST(request: NextRequest) {
  try {
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

    if (!title || price === undefined || !address || !location) {
      return NextResponse.json(
        { error: 'Campos obligatorios incompletos (título, precio, dirección, ubicación)' },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    const formattedPrice = `$${numericPrice.toLocaleString('en-US')}`;
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    const imageList = Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ];

    const newProperty = {
      title,
      slug: uniqueSlug,
      price: numericPrice,
      price_formatted: formattedPrice,
      price_period: status === 'rent' ? (pricePeriod || '/mo') : null,
      address,
      location,
      beds: Number(beds) || 1,
      baths: Number(baths) || 1,
      area: area || '200 m²',
      image_url: imageList,
      image_alt: title,
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

    const { data: inserted, error: insertError } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (insertError) {
      console.error('[Properties API] Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: inserted });
  } catch (err: unknown) {
    console.error('[Properties API] Error:', err);
    const message = err instanceof Error ? err.message : 'Error creando propiedad';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
