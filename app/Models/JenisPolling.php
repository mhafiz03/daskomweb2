<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class JenisPolling
 * 
 * @property int $id
 * @property string $judul
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Polling[] $pollings
 *
 * @package App\Models
 */
class JenisPolling extends Model
{
	use HasFactory;

	protected $table = 'jenis_pollings';

	protected $fillable = [
		'judul'
	];

	public function pollings()
	{
		return $this->hasMany(Polling::class, 'polling_id');
	}
}
