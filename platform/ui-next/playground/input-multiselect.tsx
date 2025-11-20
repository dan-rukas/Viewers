import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeWrapper } from '../src/components/ThemeWrapper';
import { InputMultiSelect } from '../src/components/InputMultiSelect';
import { Card, CardHeader, CardTitle, CardContent } from '../src/components/Card';

function Demo() {
  const modalities = React.useMemo(
    () => [
      'CT','MR','PT','US','XA','CR','DX','MG','NM','OT','PX','RF','RG','SC','SM','ES','XC','IO','IVOCT','PXCT'
    ],
    []
  );

  const fruits = React.useMemo(
    () => [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
      { value: 'grape', label: 'Grape' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'mango', label: 'Mango' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'watermelon', label: 'Watermelon' },
    ],
    []
  );

  const [selectedModalities, setSelectedModalities] = React.useState<string[]>(['CT']);
  const [selectedFruits, setSelectedFruits] = React.useState<string[]>([]);

  return (
    <ThemeWrapper>
      <div className="min-h-screen w-screen bg-background text-foreground">
        <div className="mx-auto grid max-w-3xl gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>InputMultiSelect — Modalities (basic)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <InputMultiSelect options={modalities} value={selectedModalities} onChange={setSelectedModalities}>
                  <InputMultiSelect.Field>
                    <InputMultiSelect.Summary />
                    <InputMultiSelect.Input ariaLabel="Filter Modalities" placeholder="Search modalities" />
                  </InputMultiSelect.Field>
                  <InputMultiSelect.Content fitToContent maxWidth={320}>
                    <InputMultiSelect.Options />
                  </InputMultiSelect.Content>
                </InputMultiSelect>

                <div className="text-sm text-muted-foreground">
                  Selected: {selectedModalities.length ? selectedModalities.join(', ') : '—'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>InputMultiSelect — Fruits (single summary)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <InputMultiSelect options={fruits} value={selectedFruits} onChange={setSelectedFruits}>
                  <InputMultiSelect.Field>
                    <InputMultiSelect.Summary variant="single" />
                    <InputMultiSelect.Input ariaLabel="Filter Fruits" placeholder="Search fruits" />
                  </InputMultiSelect.Field>
                  <InputMultiSelect.Content fitToContent maxWidth={320}>
                    <InputMultiSelect.Options />
                  </InputMultiSelect.Content>
                </InputMultiSelect>

                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFruits.length ? selectedFruits.join(', ') : '—'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeWrapper>
  );
}

const el = document.getElementById('root');
if (!el) throw new Error('Root element not found');
createRoot(el).render(<Demo />);
