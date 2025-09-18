-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi', 'ta', 'te')),
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farms table
CREATE TABLE public.farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  size NUMERIC NOT NULL,
  crop_type TEXT NOT NULL,
  sowing_date DATE NOT NULL,
  irrigation_type TEXT NOT NULL CHECK (irrigation_type IN ('drip', 'sprinkler', 'flood', 'manual')),
  soil_nitrogen NUMERIC NOT NULL,
  soil_phosphorus NUMERIC NOT NULL,
  soil_potassium NUMERIC NOT NULL,
  soil_ph NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('irrigation', 'fertilizer', 'pest', 'weather')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  actual_yield NUMERIC NOT NULL,
  issues TEXT[] NOT NULL DEFAULT '{}',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only access their own data)
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- RLS Policies for farms (users can only access their own farms)
CREATE POLICY "Users can view their own farms" ON public.farms
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own farms" ON public.farms
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own farms" ON public.farms
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own farms" ON public.farms
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for alerts (users can only access alerts for their farms)
CREATE POLICY "Users can view alerts for their farms" ON public.alerts
  FOR SELECT USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can create alerts for their farms" ON public.alerts
  FOR INSERT WITH CHECK (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update alerts for their farms" ON public.alerts
  FOR UPDATE USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete alerts for their farms" ON public.alerts
  FOR DELETE USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

-- RLS Policies for feedback (users can only access feedback for their farms)
CREATE POLICY "Users can view feedback for their farms" ON public.feedback
  FOR SELECT USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can create feedback for their farms" ON public.feedback
  FOR INSERT WITH CHECK (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update feedback for their farms" ON public.feedback
  FOR UPDATE USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete feedback for their farms" ON public.feedback
  FOR DELETE USING (farm_id IN (SELECT id FROM public.farms WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;