<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Configuration
 *
 * @property int $id
 * @property bool $registrationPraktikan_activation
 * @property bool $registrationAsisten_activation
 * @property bool $tp_activation
 * @property bool $tubes_activation
 * @property bool $secretfeature_activation
 * @property bool $polling_activation
 * @property bool $tp_schedule_enabled
 * @property Carbon|null $tp_schedule_start_at
 * @property Carbon|null $tp_schedule_end_at
 * @property string $kode_asisten
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Configuration extends Model
{
    protected $table = 'configurations';

    protected $casts = [
        'registrationPraktikan_activation' => 'bool',
        'registrationAsisten_activation' => 'bool',
        'tp_activation' => 'bool',
        'tp_schedule_enabled' => 'bool',
        'tp_schedule_start_at' => 'datetime',
        'tp_schedule_end_at' => 'datetime',
        'tubes_activation' => 'bool',
        'secretfeature_activation' => 'bool',
        'polling_activation' => 'bool',
    ];

    protected $hidden = [
        'secretfeature_activation',
    ];

    protected $fillable = [
        'registrationPraktikan_activation',
        'registrationAsisten_activation',
        'tp_activation',
        'tp_schedule_enabled',
        'tp_schedule_start_at',
        'tp_schedule_end_at',
        'tubes_activation',
        'secretfeature_activation',
        'polling_activation',
        'kode_asisten',
    ];

    public function refreshTpActivationFromSchedule(): void
    {
        if (! $this->tp_schedule_enabled) {
            return;
        }

        if (! $this->tp_schedule_start_at || ! $this->tp_schedule_end_at) {
            return;
        }

        $now = now();
        $start = $this->tp_schedule_start_at instanceof Carbon
            ? $this->tp_schedule_start_at
            : Carbon::parse($this->tp_schedule_start_at);
        $end = $this->tp_schedule_end_at instanceof Carbon
            ? $this->tp_schedule_end_at
            : Carbon::parse($this->tp_schedule_end_at);

        $shouldBeActive = $now->between($start, $end, true);

        if ((bool) $this->tp_activation !== $shouldBeActive) {
            $this->tp_activation = $shouldBeActive;
            $this->saveQuietly();
        }
    }
}
