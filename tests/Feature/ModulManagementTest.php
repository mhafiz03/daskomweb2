<?php

namespace Tests\Feature;

use App\Models\Asisten;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ModulManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);
    }

    protected function actingAsAssistantWithPermissions(array $permissions): Asisten
    {
        $role = Role::create([
            'name' => 'TEST-ROLE',
            'guard_name' => 'asisten',
        ]);

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'asisten',
            ]);
        }

        $role->syncPermissions($permissions);

        $assistant = Asisten::factory()->create([
            'role_id' => $role->id,
        ]);

        $assistant->assignRole($role);

        $this->actingAs($assistant, 'asisten');

        return $assistant;
    }

    public function test_assistant_can_create_module_with_learning_point(): void
    {
        $this->actingAsAssistantWithPermissions(['manage-modul']);

        $payload = [
            'judul' => 'Modul Integrasi',
            'deskripsi' => 'Mahasiswa mampu memahami konsep integral.',
            'isEnglish' => 0,
            'isUnlocked' => 1,
            'modul_link' => 'https://example.com/modul.pdf',
            'ppt_link' => 'https://example.com/slides.pptx',
            'video_link' => 'https://youtu.be/example',
        ];

        $session = $this->app['session'];
        $session->start();
        $token = $session->token();

        $response = $this->post('/api-v1/modul', $payload + ['_token' => $token]);

        $response->assertRedirect();

        $this->assertDatabaseHas('moduls', [
            'judul' => $payload['judul'],
            'deskripsi' => $payload['deskripsi'],
        ]);
    }

    public function test_learning_point_is_required_when_creating_module(): void
    {
        $this->actingAsAssistantWithPermissions(['manage-modul']);

        $payload = [
            'judul' => 'Modul Tanpa Poin',
            'isEnglish' => 0,
            'isUnlocked' => 0,
        ];

        $session = $this->app['session'];
        $session->start();
        $token = $session->token();

        $response = $this->from('/modul')->post('/api-v1/modul', $payload + ['_token' => $token]);

        $response
            ->assertRedirect('/modul')
            ->assertSessionHasErrors(['deskripsi']);

        $this->assertDatabaseMissing('moduls', [
            'judul' => $payload['judul'],
        ]);
    }
}
