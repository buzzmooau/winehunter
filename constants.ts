import { Winery, District } from './types';

export const WINERIES: Winery[] = [
  // Murrumbateman Region
  {
    id: 'clonakilla',
    name: 'Clonakilla',
    district: District.Murrumbateman,
    description: 'A legendary name in Australian wine, renowned for the Shiraz Viognier that redefined the cool-climate style. Experience elegance, spice, and floral aromatics in a setting that breathes history.',
    varieties: ['Shiraz Viognier', 'Riesling', 'Syrah'],
    coordinates: { x: 30, y: 25 },
    address: '3 Crisps Lane, Murrumbateman NSW',
    website: 'https://clonakilla.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'helm',
    name: 'Helm Wines',
    district: District.Murrumbateman,
    description: 'Home to Ken Helm, a champion of Riesling. This heritage-listed 1888 schoolhouse cellar door offers a masterclass in crisp, age-worthy Rieslings and robust Cabernets.',
    varieties: ['Riesling', 'Cabernet Sauvignon'],
    coordinates: { x: 25, y: 32 },
    address: '19 Butts Rd, Murrumbateman NSW',
    website: 'https://www.helmwines.com.au/shopnew/',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'four-winds',
    name: 'Four Winds Vineyard',
    district: District.Murrumbateman,
    description: 'A vibrant family-run destination where wood-fired pizzas meet award-winning Sangiovese. Relaxed, welcoming, and perfect for a sunny afternoon with friends.',
    varieties: ['Sangiovese', 'Riesling', 'Shiraz'],
    coordinates: { x: 35, y: 20 },
    address: '9 Patemans Ln, Murrumbateman NSW',
    website: 'https://www.fourwindsvineyard.com.au/our-wines/',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'eden-road',
    name: 'Eden Road Wines',
    district: District.Murrumbateman,
    description: 'Dedicated to unique terroir expression, capturing the essence of the high country. Their wines, from Syrah to Chardonnay, are crafted to showcase the distinct personality of each vineyard site.',
    varieties: ['Syrah', 'Pinot Noir', 'Chardonnay'],
    coordinates: { x: 32, y: 38 },
    address: '3182 Barton Hwy, Murrumbateman NSW',
    website: 'https://edenroadwines.com.au/collections/all',
    image: 'https://images.unsplash.com/photo-1596130420485-6147985f92d4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'shaw-wines',
    name: 'Shaw Wines',
    district: District.Murrumbateman,
    description: 'Experience stunning modern architecture paired with premium cool-climate wines. The impressive cellar door invites you to taste deeply flavored Cabernet and elegant Riesling in comfort.',
    varieties: ['Riesling', 'Cabernet Sauvignon', 'Shiraz'],
    coordinates: { x: 28, y: 22 },
    address: '34 Isabel Drive, Murrumbateman NSW',
    website: 'https://shawwines.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1464638681273-0962e9b53566?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gallagher',
    name: 'Gallagher Wines',
    district: District.Murrumbateman,
    description: 'A true artisan experience featuring small-batch wines and house-made cheeses. Discover the perfect pairing of their celebrated sparkling wines with gourmet local produce.',
    varieties: ['Shiraz', 'Sparkling'],
    coordinates: { x: 20, y: 28 },
    address: '2770 Dog Trap Rd, Murrumbateman NSW',
    website: 'https://www.gallagherwines.com.au/index.php?wines',
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dionysus',
    name: 'Dionysus Winery',
    district: District.Murrumbateman,
    description: 'A boutique gem focusing on sustainable practices and hand-crafted quality. Enjoy their characterful Cabernet and Viognier in a warm, intimate setting.',
    varieties: ['Cabernet Sauvignon', 'Shiraz', 'Viognier'],
    coordinates: { x: 22, y: 35 },
    address: '1 Patemans Ln, Murrumbateman NSW',
    website: 'https://www.dionysus-winery.com.au/category/all-products',
    image: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'the-vintners-daughter',
    name: 'The Vintner\'s Daughter',
    district: District.Murrumbateman,
    description: 'Stephanie Helm carries on the family legacy with award-winning wines from a historic property. Taste the passion in their delicately crafted Riesling and Merlot.',
    varieties: ['Riesling', 'Merlot', 'Shiraz'],
    coordinates: { x: 26, y: 29 },
    address: '5 Crisps Ln, Murrumbateman NSW',
    website: 'https://thevintnersdaughter.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1528823872051-402f0190533d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'wimbaliri',
    name: 'Wimbaliri Wines',
    district: District.Murrumbateman,
    description: 'Ideally situated to capture the cool climate essence, producing intense, elegant wines. Their Pinot Noir and Shiraz reflect a deep understanding of the local terroir.',
    varieties: ['Pinot Noir', 'Shiraz', 'Chardonnay'],
    coordinates: { x: 29, y: 33 },
    address: '3180 Barton Hwy, Murrumbateman NSW',
    website: 'https://wimbaliri.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'jeir-creek',
    name: 'Jeir Creek Wines',
    district: District.Murrumbateman,
    description: 'A long-standing producer with a reputation for consistency and awards since 1984. Explore a diverse range from crisp Sauvignon Blanc to luscious Botrytis Riesling.',
    varieties: ['Sauvignon Blanc', 'Botrytis Riesling'],
    coordinates: { x: 24, y: 39 },
    address: '122 Bluebell Ln, Murrumbateman NSW',
    website: 'https://www.jeircreekwines.com.au/collections/all-wines',
    image: 'https://images.unsplash.com/photo-1572569997486-89659ce53186?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mckellar-ridge',
    name: 'McKellar Ridge Wines',
    district: District.Murrumbateman,
    description: 'Renowned for high-quality, limited-release wines that showcase varietal purity. A must-stop for those seeking expressive Shiraz Viognier and Sauvignon Blanc.',
    varieties: ['Shiraz Viognier', 'Sauvignon Blanc'],
    coordinates: { x: 32, y: 30 },
    address: '2 Euroka Ave, Murrumbateman NSW',
    website: 'https://www.mckellarridgewines.com.au/buy/wine',
    image: 'https://images.unsplash.com/photo-1565597984483-7d885685514b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'murrumbateman-winery',
    name: 'Murrumbateman Winery',
    district: District.Murrumbateman,
    description: 'A warm, pet-friendly cellar door offering delicious local produce platters. Enjoy their quality Riesling and Rose in a relaxed, rustic setting.',
    varieties: ['Shiraz', 'Riesling', 'Rose'],
    coordinates: { x: 30, y: 20 },
    address: '131 McIntosh Cct, Murrumbateman NSW',
    website: 'https://murrumbatemanwinery.com.au/wines-list/',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'long-rail-gully',
    name: 'Long Rail Gully Wines',
    district: District.Murrumbateman,
    description: 'Nestled in a picturesque amphitheatre, this vineyard produces wines that perfectly reflect its unique microclimate. The Pinot Gris and Shiraz are standout examples of the region.',
    varieties: ['Riesling', 'Pinot Gris', 'Shiraz'],
    coordinates: { x: 28, y: 15 },
    address: '161 Long Rail Gully Rd, Murrumbateman NSW',
    website: 'https://www.longrailgully.com.au/shop',
    image: 'https://images.unsplash.com/photo-1534234828563-02511c759536?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'barton-estate',
    name: 'Barton Estate Winery',
    district: District.Murrumbateman,
    description: 'A super-premium producer committed to cool-climate excellence. Their meticulously managed vineyard yields intense Shiraz and aromatic Riesling of great structure.',
    varieties: ['Shiraz', 'Riesling', 'Sangiovese'],
    coordinates: { x: 36, y: 35 },
    address: '2307 Barton Hwy, Murrumbateman NSW',
    website: 'https://www.bartonestate.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&q=80&w=800'
  },
   {
    id: 'yarrh',
    name: 'Yarrh Wines',
    district: District.Murrumbateman,
    description: 'Sustainable practices meet distinctive regional character. Yarrh Wines offers a thoughtful range of varietals, including excellent Sangiovese, in a beautiful bushland setting.',
    varieties: ['Sangiovese', 'Shiraz', 'Riesling'],
    coordinates: { x: 18, y: 25 },
    address: '440 Greenwood Rd, Murrumbateman NSW',
    website: 'https://www.yarrhwines.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1471189601863-78c5c3779e60?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'quarry-hill',
    name: 'Quarry Hill',
    district: District.Murrumbateman,
    description: 'A charming small family vineyard producing high-quality wines with personal care. Their Pinot Noir and Savagnin are delightful discoveries for the curious drinker.',
    varieties: ['Shiraz', 'Pinot Noir', 'Savagnin'],
    coordinates: { x: 33, y: 36 },
    address: 'Barton Hwy, Murrumbateman NSW',
    website: 'https://quarryhill.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'intrepidus',
    name: 'Intrepidus Wines',
    district: District.Murrumbateman,
    description: 'A small-batch producer daring to explore alternative varieties. Taste the adventure in their expressive Tempranillo and Sangiovese.',
    varieties: ['Tempranillo', 'Sangiovese'],
    coordinates: { x: 29, y: 37 },
    address: 'Murrumbateman NSW',
    website: 'https://intrepiduswines.com.au/page-zl3ShP',
    image: 'https://images.unsplash.com/photo-1505567745926-ba89000d255a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ravensworth',
    name: 'Ravensworth Wines',
    district: District.Murrumbateman,
    description: 'Highly acclaimed for innovative blends and natural winemaking. Expect complex, texture-driven wines that challenge and delight the palate.',
    varieties: ['Shiraz Viognier', 'Riesling', 'Sangiovese'],
    coordinates: { x: 31, y: 27 },
    address: 'Murrumbateman NSW',
    website: 'https://www.ravensworthwines.com.au/collections/all',
    image: 'https://images.unsplash.com/photo-1529124230810-72c2194b8e21?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'vineyard-1207',
    name: 'Vineyard 1207',
    district: District.Murrumbateman,
    description: 'A boutique family estate dedicated to premium quality. Their Syrah and Cabernet Sauvignon showcase the elegance achievable in this specific terroir.',
    varieties: ['Syrah', 'Cabernet Sauvignon'],
    coordinates: { x: 38, y: 40 },
    address: '1207 Nanima Rd, Murrumbateman NSW',
    website: 'https://www.vineyard1207.com.au/',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800'
  },


  // Hall / Wallaroo
  {
    id: 'brindabella',
    name: 'Brindabella Hills',
    district: District.Hall,
    description: 'Perched on a ridge with commanding views over the Murrumbidgee River. The stunning location is matched by robust reds and vibrant whites.',
    varieties: ['Shiraz', 'Cabernet', 'Sauvignon Blanc'],
    coordinates: { x: 45, y: 55 },
    address: '156 Woodhill Dr, Wallaroo NSW',
    website: 'https://www.brindabellahills.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1563812709230-0eb537ba6a9e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'surveyors-hill',
    name: 'Surveyor\'s Hill',
    district: District.Hall,
    description: 'Located in Wallaroo, this winery offers panoramic views and distinctive small-batch wines. Known for interesting varietals like Touriga Nacional alongside classic Riesling.',
    varieties: ['Cabernet Sauvignon', 'Touriga Nacional', 'Riesling'],
    coordinates: { x: 42, y: 58 },
    address: '215 Brooklands Rd, Wallaroo NSW',
    website: 'https://www.surveyorshill.com.au/buy-wine/',
    image: 'https://images.unsplash.com/photo-1568283084903-82559384742e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'wallaroo-wines',
    name: 'Wallaroo Wines',
    district: District.Hall,
    description: 'Producing classic cool-climate varieties in the Hall region. A reliable producer of elegant Riesling and spicy Shiraz that speak of their origin.',
    varieties: ['Riesling', 'Cabernet', 'Shiraz'],
    coordinates: { x: 44, y: 52 },
    address: '196 Brooklands Rd, Wallaroo NSW',
    website: 'https://www.wallaroowines.com.au/wines',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'nick-oleary',
    name: 'Nick O\'Leary Wines',
    district: District.Hall,
    description: 'Modern winemaking at its finest, delivering highly acclaimed Riesling and Shiraz. Nick O\'Leary captures the vibrancy and energy of the Canberra District.',
    varieties: ['Riesling', 'Shiraz'],
    coordinates: { x: 46, y: 50 },
    address: '1496 Wallaroo Rd, Wallaroo NSW',
    website: 'https://nickolearywines.com.au/collections/all',
    image: 'https://images.unsplash.com/photo-1599380753086-6469792040d9?auto=format&fit=crop&q=80&w=800'
  },
   {
    id: 'capital-wines',
    name: 'Capital Wines',
    district: District.Hall,
    description: 'Famous for their Kyeema Vineyard old vine Shiraz and whimsical labels. A visit here promises character, history, and serious wine with a fun attitude.',
    varieties: ['Shiraz', 'Riesling', 'Merlot'],
    coordinates: { x: 48, y: 56 },
    address: '13 Gladstone St, Hall ACT',
    website: 'https://www.capitalwines.com.au/visit-us',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
   {
    id: 'kyeema',
    name: 'Kyeema Wines',
    district: District.Hall,
    description: 'Showcasing single-vineyard excellence from the historic Kyeema vineyard. Expect depth and complexity in their Shiraz and Tempranillo.',
    varieties: ['Shiraz', 'Merlot', 'Tempranillo'],
    coordinates: { x: 49, y: 54 },
    address: 'Hall ACT',
    website: 'https://www.capitalwines.com.au/',
    image: 'https://images.unsplash.com/photo-1566938992015-77353f09d846?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pankhurst',
    name: 'Pankhurst Wines',
    district: District.Hall,
    description: 'Just outside Hall, offering sweeping views and fine wines. Their Pinot Noir and Chardonnay are crafted to reflect the serene beauty of their location.',
    varieties: ['Pinot Noir', 'Chardonnay', 'Arneis'],
    coordinates: { x: 40, y: 53 },
    address: 'Old Woodgrove, Wallaroo NSW',
    website: 'https://pankhurstwines.com.au/shop-2/',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'poachers',
    name: 'Poachers Vineyard',
    district: District.Hall,
    description: 'A destination for the senses, combining a vineyard with the famous Poachers Pantry smokehouse. Savour elegant wines alongside artisan smoked meats.',
    varieties: ['Sauvignon Blanc', 'Pinot Noir', 'Syrah'],
    coordinates: { x: 43, y: 48 },
    address: '431 Nanima Rd, Springrange NSW',
    website: 'https://poacherspantry.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1557997380-6ad22e6b01b6?auto=format&fit=crop&q=80&w=800'
  },

  // Gundaroo
  {
    id: 'gundog-estate',
    name: 'Gundog Estate',
    district: District.Gundaroo,
    description: 'A boutique producer housed in historic stables, focusing on premium Semillon and Shiraz. Their innovative approach yields wines of remarkable freshness and vitality.',
    varieties: ['Semillon', 'Shiraz', 'Riesling'],
    coordinates: { x: 60, y: 18 },
    address: 'Cork St, Gundaroo NSW',
    website: 'https://gundogestate.com.au/shop-wines/',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'tallaganda-hill',
    name: 'Tallaganda Hill Winery',
    district: District.Gundaroo,
    description: 'A charming family winery producing wines with heart and character. Their Shiraz and Vermentino are perfect reflections of the Gundaroo terroir.',
    varieties: ['Shiraz', 'Vermentino', 'Cabernet'],
    coordinates: { x: 62, y: 22 },
    address: '170 Gundaroo Rd, Gundaroo NSW',
    website: 'https://tallagandahill.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800'
  },

  // Collector / North
  {
    id: 'collector-wines',
    name: 'Collector Wines',
    district: District.Collector,
    description: 'Alex McKay crafts wines that eloquently express the Canberra District. Known for the "Marked Tree" Red, these wines are elegant, structured, and highly collected.',
    varieties: ['Shiraz', 'Sangiovese', 'Chardonnay'],
    coordinates: { x: 50, y: 8 },
    address: 'Murray St, Collector NSW',
    website: 'https://collectorwines.com.au/collections/explore-our-range',
    image: 'https://images.unsplash.com/photo-1528823872051-402f0190533d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mallaluka',
    name: 'Mallaluka Wines',
    district: District.Murrumbateman, // Geographically Yass River, but close to Murrumbateman contextually for map
    description: 'Embracing minimal intervention, Mallaluka produces authentic wines from their family farm. Expect characterful Syrah and Sangiovese with a true sense of place.',
    varieties: ['Syrah', 'Cabernet', 'Sangiovese'],
    coordinates: { x: 25, y: 12 },
    address: '517 Dog Trap Rd, Yass NSW',
    website: 'https://www.mallaluka.com.au/our-wines-1',
    image: 'https://images.unsplash.com/photo-1596130420485-6147985f92d4?auto=format&fit=crop&q=80&w=800'
  },

  // Lake George
  {
    id: 'lake-george',
    name: 'Lake George Winery',
    district: District.LakeGeorge,
    description: 'One of the oldest vineyards in the region, offering history and hospitality on the shores of Lake George. Their Pinot Noir is a classic expression of the cool lake climate.',
    varieties: ['Pinot Noir', 'Chardonnay', 'Rose'],
    coordinates: { x: 80, y: 35 },
    address: 'Federal Hwy, Lake George NSW',
    website: 'https://www.lakegeorgewinery.com.au/shop',
    image: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lerida-estate',
    name: 'Lerida Estate',
    district: District.LakeGeorge,
    description: 'Famed for its striking architecture and equally impressive wines. Situated by Lake George, it produces Pinot Noir of finesse and complexity.',
    varieties: ['Pinot Noir', 'Shiraz Viognier'],
    coordinates: { x: 82, y: 42 },
    address: 'Federal Hwy, Lake George NSW',
    website: 'https://www.leridaestate.com.au/collections/all',
    image: 'https://images.unsplash.com/photo-1464638681273-0962e9b53566?auto=format&fit=crop&q=80&w=800'
  },

  // Bungendore / Wamboin
  {
    id: 'lark-hill',
    name: 'Lark Hill',
    district: District.Bungendore,
    description: 'A pioneer of biodynamic farming in the region. Their high-altitude site yields intense Gruner Veltliner and Pinot Noir that are pure, vibrant, and alive.',
    varieties: ['Gruner Veltliner', 'Pinot Noir', 'Riesling'],
    coordinates: { x: 70, y: 75 },
    address: '31 Joe Rocks Rd, Bungendore NSW',
    website: 'https://larkhill.wine/shop',
    image: 'https://images.unsplash.com/photo-1505567745926-ba89000d255a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'contentious-character',
    name: 'Contentious Character',
    district: District.Wamboin,
    description: 'Contemporary, edgy, and known for releasing aged wines alongside modern twists. A visit here is about good food, great wine, and lively conversation.',
    varieties: ['Pinot Noir', 'Merlot', 'Riesling'],
    coordinates: { x: 75, y: 65 },
    address: '810 Norton Rd, Wamboin NSW',
    website: 'https://www.contentiouscharacter.com.au/Wines',
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'norton-road',
    name: 'Norton Road Wines',
    district: District.Wamboin,
    description: 'Specializing in Pinot Noir and Riesling, with a strong focus on food pairing at their onsite restaurant. Enjoy wines grown with care in the Wamboin hills.',
    varieties: ['Pinot Noir', 'Riesling', 'Chardonnay'],
    coordinates: { x: 72, y: 68 },
    address: '344 Norton Rd, Wamboin NSW',
    website: 'https://nortonroadwines.com.au/shop/',
    image: 'https://images.unsplash.com/photo-1599380753086-6469792040d9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'summerhill-road',
    name: 'Summerhill Road Vineyard',
    district: District.Bungendore, // Bywong
    description: 'A small, dedicated family vineyard in Bywong producing award-winning wines. Their commitment to quality shines in their expressive Riesling and Pinot Noir.',
    varieties: ['Riesling', 'Sauvignon Blanc', 'Pinot Noir'],
    coordinates: { x: 68, y: 60 },
    address: 'Summerhill Rd, Bywong NSW',
    website: 'http://www.summerhillroad.com.au/',
    image: 'https://images.unsplash.com/photo-1534234828563-02511c759536?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'corang-estate',
    name: 'Corang Estate',
    district: District.Bungendore, // Tarago, mapped near Bungendore/Lake George
    description: 'Discover the Southern Tablelands through Corang Estate. Their cool-climate Shiraz and Tempranillo offer a distinctive taste of this emerging sub-region.',
    varieties: ['Shiraz', 'Tempranillo'],
    coordinates: { x: 88, y: 50 },
    address: 'Tarago NSW',
    website: 'https://www.corangestate.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1471189601863-78c5c3779e60?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sapling-yard',
    name: 'Sapling Yard Wines',
    district: District.Bungendore,
    description: 'Handcrafted with precision and care in Bungendore. Sapling Yard creates wines of distinction, including elegant Pinot Noir and refreshing Rose.',
    varieties: ['Shiraz', 'Pinot Noir', 'Rose'],
    coordinates: { x: 65, y: 72 },
    address: 'Bungendore NSW',
    website: 'https://www.saplingyard.com.au/shop',
    image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sassafras',
    name: 'Sassafras Wines',
    district: District.Bungendore, // Nerriga/Corang
    description: 'Wild, natural, and authentic. Sassafras Wines reflect the rugged landscape of Nerriga with unique offerings like Ancestral Sparkling and Fiano.',
    varieties: ['Ancestral Sparkling', 'Fiano'],
    coordinates: { x: 85, y: 55 },
    address: 'Nerriga NSW',
    website: 'https://sassafraswines.com.au/shop',
    image: 'https://images.unsplash.com/photo-1563812709230-0eb537ba6a9e?auto=format&fit=crop&q=80&w=800'
  },

  // Majura
  {
    id: 'mount-majura',
    name: 'Mount Majura Vineyard',
    district: District.Majura,
    description: 'A stone\'s throw from the city, yet a world away. Pioneering varieties like Tempranillo and Graciano, Mount Majura sets the benchmark for innovation and quality.',
    varieties: ['Tempranillo', 'Riesling', 'Graciano'],
    coordinates: { x: 55, y: 65 },
    address: '88 Lime Kiln Rd, Majura ACT',
    website: 'https://www.mountmajura.com.au/wines/',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_INSTRUCTION = `You are an expert Sommelier and Tour Guide for the Canberra District Wine Region. 
You are friendly, sophisticated, and passionate about cool-climate wines. 
When asked about specific wineries, use the provided context to give accurate details, but feel free to elaborate on the general characteristics of the region (e.g., the spiciness of the Shiraz, the floral notes of the Riesling).
Keep responses concise (under 100 words) unless asked for a detailed itinerary.
`;