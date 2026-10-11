import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/database';
import { backupService, buildBackupData } from '../backupService';

describe('full backup coverage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await db.delete();
    await db.open();
  });

  it('backs up every database table and restores all listed local app data', async () => {
    const soundDataUrl = 'data:audio/wav;base64,YXVkaW8=';
    const reminders = JSON.stringify([{ id: 'reminder-1', title: 'جلسه لندن' }]);
    const appSettings = JSON.stringify({ state: { theme: 'amber', dashboardRange: 'year' }, version: 1 });
    localStorage.setItem('tradermind-reminder-custom-sound', soundDataUrl);
    localStorage.setItem('tradermind-reminders', reminders);
    localStorage.setItem('tradermind-app-storage', appSettings);
    localStorage.setItem('tradermind-custom-symbols', JSON.stringify(['EURUSD']));
    localStorage.setItem('perf_preferred_sessions', JSON.stringify(['london']));

    const payload = await buildBackupData();
    const backupTables = Object.keys(payload.data).filter(name => name !== 'settings').sort();
    const databaseTables = db.tables.map(table => table.name).sort();

    expect(backupTables).toEqual(databaseTables);
    expect(payload.data.settings['tradermind-reminder-custom-sound']).toBe(soundDataUrl);
    expect(payload.data.settings['tradermind-reminders']).toBe(reminders);
    expect(payload.metadata.totalRecords).toBe(0);

    localStorage.setItem('tradermind-reminders', '[]');
    localStorage.setItem('perf_preferred_sessions', JSON.stringify(['new-york']));
    await backupService.importReplace(payload.data);

    expect(localStorage.getItem('tradermind-reminders')).toBe(reminders);
    expect(localStorage.getItem('tradermind-reminder-custom-sound')).toBe(soundDataUrl);
    expect(localStorage.getItem('tradermind-app-storage')).toBe(appSettings);
    expect(localStorage.getItem('perf_preferred_sessions')).toBe(JSON.stringify(['london']));
  });
});
